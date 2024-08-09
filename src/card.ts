import { Assets, Sprite, Container, PointData } from 'pixi.js';

export class Card extends Container {
    private readonly NO_VALUE = -1;
    private readonly BACK_IMAGE_URL = '';

    private _cardImage: Sprite;
    private _cardBackImage: Sprite;
    private _cardValue = this.NO_VALUE;
    private _isFaceUp = false;

    constructor(textureUrl: string, value: number) {
        super();
        this._cardValue = value;

        this.createCard(textureUrl);
        this.interactive = true;
        this.on('pointerdown', this.handleCardClick);
    }

    public changeSize(size: PointData): void {
        this.setSize(size.x, size.y);
        this._cardImage.scale = Math.min(size.x / this._cardImage.x, size.y / this._cardImage.y);
        this._cardBackImage.scale = Math.min(size.x / this._cardBackImage.x, size.y / this._cardBackImage.y);
    }

    public changePosition(pos: PointData): void {
        this.x = pos.x;
        this.y = pos.y;
    }

    private show(): void {
        this._cardImage.visible = true;
        this._cardBackImage.visible = false;
        this._isFaceUp = true;
    }

    private hide(): void {
        this._cardImage.visible = false;
        this._cardBackImage.visible = true;
        this._isFaceUp = false;
    }

    private createCard(textureUrl: string): void {
        this._cardImage = new Sprite(Assets.get(textureUrl));
        this._cardBackImage = new Sprite(Assets.get(this.BACK_IMAGE_URL));
        this.addChild(this._cardBackImage);
        this.addChild(this._cardImage);
        this.hide();
    }

    private handleCardClick(): void {
        if (!this._isFaceUp) this.show();
    }
}