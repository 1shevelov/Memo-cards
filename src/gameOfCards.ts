import { EventEmitter } from 'pixi.js';
import { GameEvents, ErrorValues, shuffleArray, getRandomIntInclusive } from './config';
import { MAX_DIFF_PICS } from './config';

// can be 3 or more later
export const CARDS_TO_OPEN = 2;

export class GameOfCards {
    private events: EventEmitter;
    private cards: number[] = [];
    private openedCardsIndices: number[] = [];

    constructor(events: EventEmitter) {
        this.events = events;
        this.generateDeck();
        this.events.on(GameEvents.CARD_FLIPPED, this.handleCardFlip);
    }

    public getCards(): number[] {
        return this.cards;
    }

    private generateDeck(): void {
        const pairsNum = getRandomIntInclusive(MAX_DIFF_PICS / 2, MAX_DIFF_PICS);
        const deck: number[] = [];
        for (let i = 0; i < pairsNum; i++) {
            for (let j = 1; j <= CARDS_TO_OPEN; j++)
                deck.push(i);
        }
        this.cards = shuffleArray(deck);
        // console.log(this.cards);
    }

    private handleCardFlip = (cardIndex: number): void => {
        if (this.cards[cardIndex] === ErrorValues.NO_CARD_VALUE) {
            console.error(`Card at index ${cardIndex} is not initialized.`);
            return;
        }
        // console.log(`Flipped card #${cardIndex}`);
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