import { Application, Container, Assets } from 'pixi.js';
import { Card } from './card';

export class Field extends Container {
    private _app: Application;
    private _rows: number;
    private _cols: number;

    private readonly VERT_BORDER = [100, 100];
    private readonly HOR_BORDER = [100, 100];
    private readonly GAP = 0.2; // of the card size

    constructor(app: Application, rows: number, cols: number) {
        super();
        this._app = app;
        this._rows = rows;
        this._cols = cols;
        this.makeField();
        this._app.stage.addChild(this);
    }

    makeField(): void {
        const cardSizeX =
            (this._app.screen.width - this.HOR_BORDER[0] - this.HOR_BORDER[1] ) /
                (this._cols * (this.GAP + 1) - this.GAP);
        const cardSizeY =
            (this._app.screen.height - this.VERT_BORDER[0] - this.VERT_BORDER[1]) /
                (this._rows * (this.GAP + 1) - this.GAP);
        let x: number;
        let y: number;
        let card: Card;
        for (let i = 0; i < this._cols; i++) {
            for (let j = 0; j < this._rows; j++) {
                x = this.HOR_BORDER[0] + cardSizeX * 0.5 + i * cardSizeX * (1 + this.GAP);
                y = this.VERT_BORDER[0] + cardSizeY * 0.5 + j * cardSizeY * (1 + this.GAP);
                card = new Card(this._app, 'clubs7', 7);
                card.changeSize({ x: cardSizeX, y: cardSizeY });
                card.changePosition({ x, y });
                this.addChild(card);
            }
        }
    }
}