import { Application, Container, Assets, EventEmitter } from "pixi.js";
import { CardView } from "./cardView";
import { CARDS_SHOW_DELAY, GameEvents, shuffleArray } from "./config";
import { getAllFaces } from "./assets";

export class FieldView extends Container {
	private readonly VERT_BORDER = [100, 100];
	private readonly HOR_BORDER = [100, 100];
	private readonly GAP = 0.2; // of the card size
	private readonly rowsMax = [6, 12, 18, 24];
	
	private app: Application;
	private events: EventEmitter;
	private rows: number;
	private cols: number;
	private field: CardView[] = [];

	private delayTimer: any;
	private isDelayedRemove = false;
	private isDelayedHide = false;
	private openedCardsIndices: number[] = [];

	constructor(app: Application, events: EventEmitter, cards: number[]) {
		super();
		this.app = app;
		this.events = events;
		this.configureField(cards.length);
		this.makeField(cards);
		this.app.stage.addChild(this);

		this.events.on(GameEvents.CARDS_NOT_MATCHED, this.handleCardsNotMatched, this);
		this.events.on(GameEvents.CARDS_MATCHED, this.handleCardsMatched, this);
		events.on(GameEvents.CARD_FLIPPED, this.removeDelay, this);
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
		// TODO:
		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				x = this.HOR_BORDER[0] + cardSizeX * 0.5 + i * cardSizeX * (1 + this.GAP);
				y =
					this.VERT_BORDER[0] +
					cardSizeY * 0.5 +
					j * cardSizeY * (1 + this.GAP);
				card = new CardView(this.events, allFaces[cards[cardsIndex]], cardsIndex);
				card.changeSize({ x: cardSizeX, y: cardSizeY });
				card.changePosition({ x, y });
				this.addChild(card);
				this.field.push(card);
				if (++cardsIndex >= cards.length) break;
			}
		}
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
		}, CARDS_SHOW_DELAY);
	}

	private handleCardsMatched(openedCardsIndices: number[]): void {
		// console.log(`Cards matched: ${openedCardsIndices.join(", ")} !`);
		this.isDelayedRemove = true;
		this.openedCardsIndices = openedCardsIndices;
		this.delayTimer = setTimeout(() => {
			openedCardsIndices.forEach((i) => this.field[i].remove());
			this.openedCardsIndices = [];
			this.isDelayedRemove = false;
			this.delayTimer = null;
		}, CARDS_SHOW_DELAY);
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
				this.openedCardsIndices.forEach((i) => this.field[i].remove());
			}
			this.openedCardsIndices = [];
		}
	}
}
