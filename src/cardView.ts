import { Assets, Sprite, Container, PointData, Application, EventEmitter } from 'pixi.js';
import * as PIXI from 'pixi.js'; 
import { GameEvents, ErrorValues } from './config';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/all';
import { CARD_HIDE_ANIMATION_DURATION, CARD_REVEAL_ANIMATION_DURATION } from './visualsConfig';

export class CardView extends Container {
    private events: EventEmitter;
    private backImageURL = '';
    private cardImage: Sprite;
    private cardBackImage: Sprite;
    private cardIndex = ErrorValues.NO_CARD_INDEX;
    private isFaceUp = false;

    private isBeingAnimated = false;
    private readonly AnimationCompletedEvent = "animation_completed";
    private animationEvents = new EventEmitter();

    constructor(
        events: EventEmitter,
        textureUrl: string,
        index: number,
    ) {
        super();
        this.events = events;
        this.cardIndex = index;

        this.backImageURL = 'green';
        this.createCard(textureUrl);
        this.interactive = true;
        this.on('pointerdown', this.handleCardClick, this);

        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);
    }

    public changeSize(size: PointData): void {
        this.cardImage.scale = Math.min(size.x / this.cardImage.width, size.y / this.cardImage.height);
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
        showTL.to(
            this.cardBackImage.scale,
            { 
                x: 0.2,
                duration: 0.25,
                ease: "power2.in",
                onComplete: () => { 
                    this.cardBackImage.visible = false;
                    this.cardImage.visible = true;
                }
            }
        );
        showTL.fromTo(
            this.cardImage.scale,
            { x: 0.2 },
            { 
                x: this.cardImage.scale.x,
                duration: CARD_REVEAL_ANIMATION_DURATION,
                ease: "power2.out",
                onComplete: () => {
                    this.cardBackImage.scale.x = startingScaleX;
                    this.isBeingAnimated = false;
                    this.animationEvents.emit(this.AnimationCompletedEvent);
                }
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
        showTL.to(
            this.cardImage.scale,
            { 
                x: 0.2, 
                duration: CARD_HIDE_ANIMATION_DURATION,
                ease: "power2.in",
                onComplete: () => { 
                    this.cardImage.visible = false;
                    this.cardBackImage.visible = true;
                }
            }
        );
        showTL.fromTo(
            this.cardBackImage.scale,
            { x: 0.2 },
            { 
                x: this.cardBackImage.scale.x,
                duration: 0.15,
                ease: "power2.out",
                onComplete: () => {
                    this.cardImage.scale.x = startingScaleX;
                    this.isBeingAnimated = false;
                    this.animationEvents.emit(this.AnimationCompletedEvent);
                }
            }
        );
    }

    public matchAndRemove(otherCardPos: PointData): void {
        if (this.isBeingAnimated) {
            this.animationEvents.once(
                this.AnimationCompletedEvent,
                () => this.matchAndRemove(otherCardPos),
            );
            return;
        }

        const PART1_DURATION = 0.5;
        const PART2_DURATION = 1.5;
        this.interactive = false;
        const centerX = (this.x + otherCardPos.x) / 2;
        const centerY = (this.y + otherCardPos.y) / 2;
        
        const matchTL = gsap.timeline();
        matchTL.to(
            this.cardImage.scale,
            { 
                x: this.cardImage.scale.x * 1.2,
                y: this.cardImage.scale.y * 1.2,
                duration: PART1_DURATION,
                // ease: "power2.out",
                yoyo: true,
                repeat: 1,
            }
        );
        matchTL.to(
            this.cardImage,
            { 
                x: centerX - this.x,
                y: centerY - this.y,
                alpha: 0.7,
                duration: PART2_DURATION,
                delay: PART1_DURATION,
                // ease: "power2.out",
                // onComplete: () => {
                ease: "power3.in",
                // onComplete: () => { 
                //     this.cardImage.visible = false;
                //     this.cardBackImage.visible = true;
                // }
            }
        );
        matchTL.to(
            this.cardImage.scale,
            { 
                x: this.cardImage.scale.x * 1.5,
                y: this.cardImage.scale.y * 1.5,
                duration: PART2_DURATION,
                delay: -PART2_DURATION,
                // ease: "power2.out",
            }
        );
        // matchTL.fromTo(
        //     this.cardBackImage.scale,
        //     { x: 0.2 },
        //     { x: this.cardBackImage.scale.x,
        //         duration: 0.2,
        //         ease: "power2.out",
        //         onComplete: () => {
        //             this.remove();
        //         }
        //     }
        // );
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