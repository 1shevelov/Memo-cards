export class GameOfCards {
    private _cards: number[] = [];

    constructor(private pairsNum: number) {
        this.generateDeck(pairsNum);
    }

    public getCards(): number[] {
        return this._cards;
    }

    private generateDeck(pairsNum: number): void {
        // const deck = Array.from({ length: pairsNum * 2 }, (_, i) => i + 1);
        const deck: number[] = [];
        for (let i = 1; i <= pairsNum; i++) {
            deck.push(i);
            deck.push(i);
        }
        // this.cards = deck.sort(() => Math.random() - 0.5);
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        this._cards = deck;
    }
}