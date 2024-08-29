import { Application, Container, Assets, EventEmitter } from "pixi.js";
import { CardView } from "./cardView";
import { GameEvents, shuffleArray } from "./config";
import { getAllFaces } from "./assets";
import { UiEvents } from "./gameUI";
import { CARDS_MATCHED_SHOW_DELAY, CARDS_UNMATCHED_SHOW_DELAY, FIELD_APPEAR_DURATION, FIELD_SHAKE_DURATION } from "./visualsConfig";
import { SizeData } from "./utils";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/all";
import * as PIXI from "pixi.js";

export class FieldView extends Container {
	private readonly VERT_BORDER = [100, 100];
	private readonly HOR_BORDER = [100, 100];
	private readonly GAP = 0.2; // of the card size
	private readonly rowsMax = [6, 12, 18, 24];
	
	private app: Application;
	private gameEvents: EventEmitter;
	private rows: number;
	private cols: number;
	private field: CardView[] = [];

	private delayTimer: any;
	private isDelayedRemove = false;
	private isDelayedHide = false;
	private openedCardsIndices: number[] = [];

	constructor(app: Application, gameEvents: EventEmitter, uiEvents: EventEmitter, cards: number[]) {
		super();
		this.app = app;
		this.gameEvents = gameEvents;
		this.configureField(cards.length);
		this.makeField(cards);
		this.app.stage.addChild(this);
		this.showField();

		this.gameEvents.on(GameEvents.CARDS_NOT_MATCHED, this.handleCardsNotMatched, this);
		this.gameEvents.on(GameEvents.CARDS_MATCHED, this.handleCardsMatched, this);
		this.gameEvents.on(GameEvents.CARD_FLIPPED, this.removeDelay, this);
		uiEvents.on(UiEvents.RELOAD_GAME, this.destroyFieldView, this);
	}

	private configureField(cardCount: number): void {
		for (let i = 0; i < this.rowsMax.length; i++) {
			if (cardCount < this.rowsMax[i]) {
				this.rows = i + 1;
				this.cols = Math.ceil(cardCount / this.rows);
				break;
			}
		}
		console.log(`rows: ${this.rows}, cols: ${this.cols}`);
	}

	private makeField(cards: number[]): void {
		let allFaces = getAllFaces();
		allFaces = shuffleArray(allFaces);
		const cardSizeX =
			(this.app.screen.width - this.HOR_BORDER[0] - this.HOR_BORDER[1]) /
			(this.cols * (this.GAP + 1) - this.GAP);
		const cardSizeY =
			(this.app.screen.height - this.VERT_BORDER[0] - this.VERT_BORDER[1]) /
			(this.rows * (this.GAP + 1) - this.GAP);
		let x: number;
		let y: number;
		let card: CardView;
		let cardsIndex = 0;

		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				x = this.HOR_BORDER[0] + cardSizeX * 0.5 + i * cardSizeX * (1 + this.GAP);
				y =
					this.VERT_BORDER[0] +
					cardSizeY * 0.5 +
					j * cardSizeY * (1 + this.GAP);
				card = new CardView(this.gameEvents, allFaces[cards[cardsIndex]], cardsIndex);
				card.changeSize({ x: cardSizeX, y: cardSizeY });
				card.changePosition({ x, y });
				this.addChild(card);
				card.alpha = 0;
				this.field.push(card);
				if (++cardsIndex >= cards.length) break;
			}
		}
	}

	private showField(): void {
		gsap.registerPlugin(PixiPlugin);
		PixiPlugin.registerPIXI(PIXI);

		const MaxAngle = 0.3;
		const showTL = gsap.timeline();
		showTL.to(this.field, {
			alpha: 1.0,
			duration: FIELD_APPEAR_DURATION,
			ease: "power2.in",
			stagger: {
				each: 0.15,
				from: "center",
				grid: [this.cols, this.rows],
			},
		});
		showTL.to(
			this.field,
			{
				rotation: -MaxAngle,
				duration: FIELD_SHAKE_DURATION / 4,
			}
		);
		showTL.fromTo(
			this.field,
			{ rotaion: -MaxAngle },
			{
				rotation: MaxAngle,
				duration: FIELD_SHAKE_DURATION,
				ease: "power1.in",
				yoyo: true,
				repeat: 3,
				onComplete: () => {
					// 	TODO: add signal to allow cards interaction
					// this.animationEvents.emit(this.AnimationCompletedEvent);
				},
			}
		);
		showTL.to(
			this.field,
			{
				rotation: 0,
				duration: FIELD_SHAKE_DURATION / 4,
			}
		);
	}

	private handleCardsNotMatched(openedCardsIndices: number[]): void {
		// console.log(`Cards not matched: ${openedCardsIndices.join(", ")}`);
		this.isDelayedHide = true;
		this.openedCardsIndices = openedCardsIndices;
		this.delayTimer = setTimeout(() => {
			openedCardsIndices.forEach((i) => this.field[i].hide());
			this.openedCardsIndices = [];
			this.isDelayedHide = false;
			this.delayTimer = null;
		}, CARDS_UNMATCHED_SHOW_DELAY * 1000);
	}

	private handleCardsMatched(openedCardsIndices: number[]): void {
		// console.log(`Cards matched: ${openedCardsIndices.join(", ")} !`);
		// this.isDelayedRemove = true;
		this.openedCardsIndices = openedCardsIndices;
		this.delayTimer = setTimeout(() => {
		// openedCardsIndices.forEach((i) => this.field[i].matchAndRemove());
			if (openedCardsIndices.length !== 2)
				console.error("Not supporting match of 3 or more currently");
			const screenSize: SizeData = { width: this.app.screen.width, height: this.app.screen.height };
			this.field[openedCardsIndices[0]].zIndex = 1;
			this.field[openedCardsIndices[0]]
				.matchAndRemove(
					this.field[openedCardsIndices[1]].getPosition(),
					screenSize,
				);
			this.field[openedCardsIndices[1]].zIndex = 1;
			this.field[openedCardsIndices[1]]
				.matchAndRemove(
					this.field[openedCardsIndices[0]].getPosition(),
					screenSize,
				);
			this.openedCardsIndices = [];
			// this.isDelayedRemove = false;
			this.delayTimer = null;
		}, CARDS_MATCHED_SHOW_DELAY * 1000);
	}

	private removeDelay(cardIndex: number): void {
		// check that clicked card is not the same as one of the opened cards
		if (this.delayTimer && !this.openedCardsIndices.includes(cardIndex)) {
			clearTimeout(this.delayTimer);
			this.delayTimer = null;
			if (this.isDelayedHide) {
				this.isDelayedHide = false;
                this.openedCardsIndices.forEach((i) => this.field[i].hide());
            } else if (this.isDelayedRemove) {
				this.isDelayedRemove = false;
				//TODO: rewrite as now match animation will be played at once
				// this.openedCardsIndices.forEach((i) => this.field[i].remove());
			}
			this.openedCardsIndices = [];
		}
	}

	private destroyFieldView(): void {
		this.parent.removeChild(this);
        this.destroy();
	}
}
