import { Assets, Sprite, Container, PointData, Application, EventEmitter } from 'pixi.js';
import * as PIXI from 'pixi.js'; 
import { GameEvents, ErrorValues } from './config';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/all';

export class CardView extends Container {
    private events: EventEmitter;
    private backImageURL = '';
    private cardImage: Sprite;
    private cardBackImage: Sprite;
    private cardIndex = ErrorValues.NO_CARD_INDEX;
    private isFaceUp = false;

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
        this.createCard(textureUrl);
        // console.log(textureUrl, index);
    }

    public changeSize(size: PointData): void {
        this.cardImage.scale = Math.min(size.x / this.cardImage.width, size.y / this.cardImage.height);
        this.cardBackImage.scale = Math.min(size.x / this.cardBackImage.width, size.y / this.cardBackImage.height);
        // console.log(size.x, size.y, this._cardBackImage.scale.x, this._cardBackImage.width, this._cardBackImage.height);
        this.setSize(this.cardBackImage.width, this.cardBackImage.height);
    }

    public changePosition(pos: PointData): void {
        this.x = pos.x;
        this.y = pos.y;
    }

    public show(): void {
        const startingScaleX = this.cardBackImage.scale.x;
        const showTL = gsap.timeline();
        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);
        showTL.to(
            this.cardBackImage.scale,
            { x: 0.2, duration: 0.3, ease: "power2.in", onComplete: () => { 
                this.cardBackImage.visible = false;
                this.cardImage.visible = true;
            }}
        );
        showTL.fromTo(
            this.cardImage.scale,
            { x: 0.2 },
            { x: this.cardImage.scale.x, duration: 0.3, ease: "power2.out", onComplete: () => {
                this.cardBackImage.scale.x = startingScaleX;
            }});
        this.isFaceUp = true;
    }

    public hide(): void {
        this.cardImage.visible = false;
        this.cardBackImage.visible = true;
        this.isFaceUp = false;
    }

    public remove(): void {
        this.parent.removeChild(this);
        this.destroy();
    }

    private createCard(textureUrl: string): void {
        this.cardImage = new Sprite(Assets.get(textureUrl));
        this.cardImage.anchor.set(0.5);
        this.cardBackImage = new Sprite(Assets.get(this.backImageURL));
        this.cardBackImage.anchor.set(0.5);
        this.addChild(this.cardBackImage);
        this.addChild(this.cardImage);
        this.hide();
    }

    private handleCardClick(): void {
        if (!this.isFaceUp) {
            this.show();
            this.events.emit(GameEvents.CARD_FLIPPED, this.cardIndex);
        }
    }
}