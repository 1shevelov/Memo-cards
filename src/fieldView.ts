import { Application, Container, Assets, EventEmitter } from "pixi.js";
import { CardView } from "./cardView";

export class FieldView extends Container {
    private _app: Application;
    private _rows: number;
    private _cols: number;

    private readonly VERT_BORDER = [100, 100];
    private readonly HOR_BORDER = [100, 100];
    private readonly GAP = 0.2; // of the card size
    private readonly rowsMax = [6, 12, 18, 24];

    constructor(
        app: Application,
        events: EventEmitter,
        cards: number[],
    ) {
        super();
        this._app = app;
        this.configureField(cards.length);
        this.makeField(cards, events);
        this._app.stage.addChild(this);
    }

    private configureField(cardCount: number): void {
        for (let i = 0; i < this.rowsMax.length; i++) {
            if (cardCount < this.rowsMax[i]) {
                this._rows = i + 1;
                this._cols = Math.ceil(cardCount / this._rows);
                break;
            }
        }
        console.log(`rows: ${this._rows}, cols: ${this._cols}`);
    }

    private makeField(cards: number[], events: EventEmitter): void {
        const cardSizeX =
            (this._app.screen.width - this.HOR_BORDER[0] - this.HOR_BORDER[1]) /
            (this._cols * (this.GAP + 1) - this.GAP);
        const cardSizeY =
            (this._app.screen.height - this.VERT_BORDER[0] - this.VERT_BORDER[1]) /
            (this._rows * (this.GAP + 1) - this.GAP);
        let x: number;
        let y: number;
        let card: CardView;
        let cardsIndex = 0
        // TODO:
        // iterate over cards
        // correctly switch rows
        for (let i = 0; i < this._cols; i++) {
            for (let j = 0; j < this._rows; j++) {
                x =
                    this.HOR_BORDER[0] +
                    cardSizeX * 0.5 +
                    i * cardSizeX * (1 + this.GAP);
                y =
                    this.VERT_BORDER[0] +
                    cardSizeY * 0.5 +
                    j * cardSizeY * (1 + this.GAP);
                card = new CardView(this._app, events, "clubs7", 7);
                card.changeSize({ x: cardSizeX, y: cardSizeY });
                card.changePosition({ x, y });
                this.addChild(card);
            }
        }
    }
}
