import { Assets, Sprite, Container, PointData, Application } from 'pixi.js';

export class Card extends Container {
    private readonly NO_VALUE = -1;
    private _backImageURL = '';

    private _cardImage: Sprite;
    private _cardBackImage: Sprite;
    private _cardValue = this.NO_VALUE;
    private _isFaceUp = false;

    constructor(app: Application, textureUrl: string, value: number) {
        super();
        this._cardValue = value;

        this._backImageURL = 'back';
        this.createCard(textureUrl);
        this.interactive = true;
        this.on('pointerdown', this.handleCardClick);
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

    private handleCardClick(): void {
        if (!this._isFaceUp) this.show();
        else this.hide();
    }
}