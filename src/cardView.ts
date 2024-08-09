import { Assets, Sprite, Container, PointData, Application, EventEmitter } from 'pixi.js';
import { GameEvents, ErrorValues } from './config';

export class CardView extends Container {
    private _backImageURL = '';

    private _cardImage: Sprite;
    private _cardBackImage: Sprite;
    private _cardIndex = ErrorValues.NO_CARD_INDEX;
    private _isFaceUp = false;

    constructor(
        app: Application,
        events: EventEmitter,
        textureUrl: string,
        index: number,
    ) {
        super();
        this._cardIndex = index;

        this._backImageURL = 'back';
        this.createCard(textureUrl);
        this.interactive = true;
        this.on('pointerdown', () => this.handleCardClick(events));
        app.stage.addChild(this);
        this.createCard(textureUrl);
    }

    public changeSize(size: PointData): void {
        this._cardImage.scale = Math.min(size.x / this._cardImage.width, size.y / this._cardImage.height);
        this._cardBackImage.scale = Math.min(size.x / this._cardBackImage.width, size.y / this._cardBackImage.height);
        // console.log(size.x, size.y, this._cardBackImage.scale.x, this._cardBackImage.width, this._cardBackImage.height);
        this.setSize(this._cardBackImage.width, this._cardBackImage.height);
    }

    public changePosition(pos: PointData): void {
        this.x = pos.x;
        this.y = pos.y;
    }

    public show(): void {
        this._cardImage.visible = true;
        this._cardBackImage.visible = false;
        this._isFaceUp = true;
    }

    public hide(): void {
        this._cardImage.visible = false;
        this._cardBackImage.visible = true;
        this._isFaceUp = false;
    }

    private createCard(textureUrl: string): void {
        this._cardImage = new Sprite(Assets.get(textureUrl));
        this._cardImage.anchor.set(0.5);
        this._cardBackImage = new Sprite(Assets.get(this._backImageURL));
        this._cardBackImage.anchor.set(0.5);
        this.addChild(this._cardBackImage);
        this.addChild(this._cardImage);
        this.hide();
    }

    private handleCardClick(events: EventEmitter): void {
        if (!this._isFaceUp) {
            this.show();
            events.emit(GameEvents.CARD_FLIPPED, this._cardIndex);
        }
        //else this.hide();
    }
}