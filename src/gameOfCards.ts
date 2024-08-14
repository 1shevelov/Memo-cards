import { EventEmitter } from 'pixi.js';
import { GameEvents, ErrorValues, shuffleArray, getRandomIntInclusive } from './config';
import { MAX_DIFF_PICS, CARDS_SHOW_DELAY } from './config';
import { UiEvents } from './gameUI';

// can be 3 or more later
export const CARDS_TO_OPEN = 2;

export class GameOfCards {
    private gameEvents: EventEmitter;
    private uiEvents: EventEmitter;
    private cards: number[] = [];
    private openedCardsIndices: number[] = [];
    private moveCounter = 0;
    private pairs2Found = 0;

    constructor(gameEvents: EventEmitter, uiEvents: EventEmitter) {
        this.gameEvents = gameEvents;
        this.uiEvents = uiEvents;
        this.generateDeck();
        this.gameEvents.on(GameEvents.CARD_FLIPPED, this.handleCardFlip, this);
    }

    public getCards(): number[] {
        return this.cards;
    }

    private generateDeck(): void {
        const pairsNum = getRandomIntInclusive(MAX_DIFF_PICS / 2, MAX_DIFF_PICS);
        this.pairs2Found = pairsNum;
        const deck: number[] = [];
        for (let i = 0; i < pairsNum; i++) {
            for (let j = 1; j <= CARDS_TO_OPEN; j++)
                deck.push(i);
        }
        this.cards = shuffleArray(deck);
        // console.log(this.cards);
    }

    private handleCardFlip (cardIndex: number): void {
        if (this.cards[cardIndex] === ErrorValues.NO_CARD_VALUE) {
            console.error(`Card at index ${cardIndex} is not initialized.`);
            return;
        }
        this.moveCounter++;
        this.uiEvents.emit(UiEvents.SET_COUNTER, this.moveCounter);
        // console.log(`Flipped card #${cardIndex}`);
        this.openedCardsIndices.push(cardIndex);
        if (this.openedCardsIndices.length === CARDS_TO_OPEN) {
            for (let i = 1; i < this.openedCardsIndices.length; i++)
                if (this.cards[this.openedCardsIndices[0]] !== this.cards[this.openedCardsIndices[i]]) {
                    this.gameEvents.emit(GameEvents.CARDS_NOT_MATCHED, this.openedCardsIndices);
                    this.openedCardsIndices = [];
                    return;
                }
            this.gameEvents.emit(GameEvents.CARDS_MATCHED, this.openedCardsIndices);
            this.uiEvents.emit(UiEvents.SHOW_MATCH_MESSAGE);
            this.openedCardsIndices = [];
            this.pairs2Found--;
            if (this.pairs2Found === 0)
                setTimeout(
                    () => this.uiEvents.emit(UiEvents.SHOW_RELOAD),
                    CARDS_SHOW_DELAY
                );
        }
    }
}