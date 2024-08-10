import { EventEmitter } from 'pixi.js';
import { GameEvents, ErrorValues } from './config';

// can be 3 or more later
export const CARDS_TO_OPEN = 2;

export class GameOfCards {
    private events: EventEmitter;
    private cards: number[] = [];
    private openedCardsIndices: number[] = [];

    constructor(events: EventEmitter, pairsNum: number) {
        this.events = events;
        this.generateDeck(pairsNum);
        this.events.on(GameEvents.CARD_FLIPPED, this.handleCardFlip);
    }

    public getCards(): number[] {
        return this.cards;
    }

    private generateDeck(pairsNum: number): void {
        // const deck = Array.from({ length: pairsNum * 2 }, (_, i) => i + 1);
        const deck: number[] = [];
        for (let i = 1; i <= pairsNum; i++) {
            for (let j = 1; j <= CARDS_TO_OPEN; j++)
                deck.push(i);
        }
        // this.cards = deck.sort(() => Math.random() - 0.5);
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        this.cards = deck;
        console.log(this.cards);
    }

    private handleCardFlip = (cardIndex: number): void => {
        if (this.cards[cardIndex] === ErrorValues.NO_CARD_VALUE) {
            console.error(`Card at index ${cardIndex} is not initialized.`);
            return;
        }
        console.log(`Flipped card #${cardIndex}`);
        this.openedCardsIndices.push(cardIndex);
        if (this.openedCardsIndices.length === CARDS_TO_OPEN) {
            for (let i = 1; i < this.openedCardsIndices.length; i++)
                if (this.cards[this.openedCardsIndices[0]] !== this.cards[this.openedCardsIndices[i]]) {
                    this.events.emit(GameEvents.CARDS_NOT_MATCHED, this.openedCardsIndices);
                    this.openedCardsIndices = [];
                    return;
                }
            this.events.emit(GameEvents.CARDS_MATCHED, this.openedCardsIndices);
            this.openedCardsIndices = [];
        }
    };
}