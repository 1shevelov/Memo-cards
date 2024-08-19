import { Assets, Sprite, Container, PointData, Application, EventEmitter } from "pixi.js";
import * as PIXI from "pixi.js";
import { GameEvents, ErrorValues } from "./config";
import { gsap } from "gsap";
import { PixiPlugin, MotionPathPlugin } from "gsap/all";
import { CARD_TURN_2NDPART_DURATION, CARD_TURN_1STPART_DURATION } from "./visualsConfig";
import { calculateQuadrant, SizeData, VectorData } from "./utils";

export class CardView extends Container {
	private events: EventEmitter;
	private backImageURL = "";
	private cardImage: Sprite;
	private cardBackImage: Sprite;
	private cardIndex = ErrorValues.NO_CARD_INDEX;
	private isFaceUp = false;

	private isBeingAnimated = false;
	private readonly AnimationCompletedEvent = "animation_completed";
	private animationEvents = new EventEmitter();

	constructor(events: EventEmitter, textureUrl: string, index: number) {
		super();
		this.events = events;
		this.cardIndex = index;

		this.backImageURL = "green";
		this.createCard(textureUrl);
		this.interactive = true;
		this.on("pointerdown", this.handleCardClick, this);

		gsap.registerPlugin(PixiPlugin);
		PixiPlugin.registerPIXI(PIXI);
		gsap.registerPlugin(MotionPathPlugin);
	}

	public changeSize(size: PointData): void {
		this.cardImage.scale = Math.min(
			size.x / this.cardImage.width,
			size.y / this.cardImage.height
		);
		this.cardBackImage.scale = this.cardImage.scale; //Math.min(size.x / this.cardBackImage.width, size.y / this.cardBackImage.height);
		// console.log(size.x, size.y, this._cardBackImage.scale.x, this._cardBackImage.width, this._cardBackImage.height);
		// this.setSize(this.cardBackImage.width, this.cardBackImage.height);
	}

	public getPosition(): PointData {
		return { x: this.x, y: this.y };
	}

	public changePosition(pos: PointData): void {
		this.x = pos.x;
		this.y = pos.y;
	}

	public show(): void {
		if (this.isBeingAnimated) {
			this.animationEvents.once(this.AnimationCompletedEvent, this.show, this);
			return;
		}

		this.isFaceUp = true;
		const startingScaleX = this.cardBackImage.scale.x;
		const showTL = gsap.timeline();
		this.isBeingAnimated = true;
		showTL.to(this.cardBackImage.scale, {
			x: 0.2,
			duration: CARD_TURN_1STPART_DURATION,
			ease: "power2.in",
			onComplete: () => {
				this.cardBackImage.visible = false;
				this.cardImage.visible = true;
			},
		});
		showTL.fromTo(
			this.cardImage.scale,
			{ x: 0.2 },
			{
				x: this.cardImage.scale.x,
				duration: CARD_TURN_2NDPART_DURATION,
				ease: "power2.out",
				onComplete: () => {
					this.cardBackImage.scale.x = startingScaleX;
					this.isBeingAnimated = false;
					this.animationEvents.emit(this.AnimationCompletedEvent);
				},
			}
		);
	}

	public hide(): void {
		if (this.isBeingAnimated) {
			this.animationEvents.once(this.AnimationCompletedEvent, this.hide, this);
			return;
		}

		this.isFaceUp = false;
		const startingScaleX = this.cardImage.scale.x;
		const showTL = gsap.timeline();
		this.isBeingAnimated = true;
		showTL.to(this.cardImage.scale, {
			x: 0.2,
			duration: CARD_TURN_1STPART_DURATION,
			ease: "power2.in",
			onComplete: () => {
				this.cardImage.visible = false;
				this.cardBackImage.visible = true;
			},
		});
		showTL.fromTo(
			this.cardBackImage.scale,
			{ x: 0.2 },
			{
				x: this.cardBackImage.scale.x,
				duration: CARD_TURN_2NDPART_DURATION,
				ease: "power2.out",
				onComplete: () => {
					this.cardImage.scale.x = startingScaleX;
					this.isBeingAnimated = false;
					this.animationEvents.emit(this.AnimationCompletedEvent);
				},
			}
		);
	}

	public matchAndRemove(otherCardPos: PointData, screenSize: SizeData): void {
		// if (this.isBeingAnimated) {
		//     this.animationEvents.once(
		//         this.AnimationCompletedEvent,
		//         () => this.matchAndRemove(otherCardPos),
		//     );
		//     return;
		// }

		const POP_DURATION = 0.4;
		const ALIGNMENT_DURATION = 1.2;
		const FLYAWAY_DURATION = 2;
		this.interactive = false;
		const centerX = (this.x + otherCardPos.x) / 2;
		const centerY = (this.y + otherCardPos.y) / 2;

		const matchTL = gsap.timeline();
		// both cards pop up
		matchTL.to(
			this.cardImage.scale,
			{
				x: this.cardImage.scale.x * 1.2,
				y: this.cardImage.scale.y * 1.2,
				duration: POP_DURATION,
				// ease: "power2.out",
				yoyo: true,
				repeat: 1,
			}
		);
		// both cards aligned...
		matchTL.to(
			this,
			{
				x: centerX,
				y: centerY,
				alpha: 0.7,
				duration: ALIGNMENT_DURATION,
				delay: POP_DURATION,
				ease: "power3.in",
				onComplete: () => {
					// this.changePosition({ x: centerX, y: centerY });
					// console.log("After centering: ", this.x, this.y);
				},
			}
		);
		// ... and growing
		matchTL.to(
			this.cardImage.scale,
			{
				x: this.cardImage.scale.x * 1.5,
				y: this.cardImage.scale.y * 1.5,
				duration: ALIGNMENT_DURATION,
				delay: -ALIGNMENT_DURATION,
				ease: "power2.out",
				onComplete: () => {
					// console.log("Before flyAway: ", this.x, this.y);
				},
			}
		);
		// building path depending on card pair center position
		const sign: VectorData =
			calculateQuadrant(
				{ x: centerX, y: centerY },
                screenSize,
			);
        const FlyAwayPath = [
            { x: centerX, y: centerY - sign.dy * screenSize.height * 0.5 },
            { x: centerX - sign.dx * screenSize.width, y: centerY - sign.dy * screenSize.height },
        ];
		// cards fly away...
		matchTL.to(
			this,
			{
				motionPath: {
					path: FlyAwayPath,
					autoRotate: false,
				},
				duration: FLYAWAY_DURATION,
				ease: "power2.in",
			}
		);
		// ... while getting smaller...
		matchTL.to(
		    this.cardImage.scale,
		    { 
				x: 0.3,
				y: 0.3,
                duration: FLYAWAY_DURATION,
				delay: -FLYAWAY_DURATION,
                ease: "power2.out",
		    }
		);
		// ... and rotating
		matchTL.to(
		    this,
		    {
				alpha: 0.5,
				rotation: 15,
                duration: FLYAWAY_DURATION,
				delay: -FLYAWAY_DURATION,
                ease: "power1.in",
		        onComplete: () => {
		            this.remove();
		        }
		    }
		);
	}

	private remove(): void {
		this.parent.removeChild(this);
		this.destroy();
	}

	private createCard(textureUrl: string): void {
		this.cardImage = new Sprite(Assets.get(textureUrl));
		this.cardImage.anchor.set(0.5);
		this.cardImage.visible = false;
		this.cardBackImage = new Sprite(Assets.get(this.backImageURL));
		this.cardBackImage.anchor.set(0.5);
		this.addChild(this.cardBackImage);
		this.addChild(this.cardImage);
		// this.hide();
	}

	private handleCardClick(): void {
		if (!this.isFaceUp) {
			this.show();
			this.events.emit(GameEvents.CARD_FLIPPED, this.cardIndex);
		}
	}
}
