export const MAX_DIFF_PICS = 8;

export const CARDS_SHOW_DELAY = 3000;

// export interface ICardForm {
//     name: string;
//     x: number;
//     y: number;
// }

// export const CardForms: ICardForm[] = [
//     { name: 'Square', x: 1, y: 1 },
//     { name: 'Portrait', x: 1, y: 2 },
//     { name: 'Landscape', x: 2, y: 1 },
// ];

export enum GameEvents {
    CARD_FLIPPED = 'card_flipped',
    CARDS_NOT_MATCHED = 'cards_not_matched',
    CARDS_MATCHED = 'cards_matched',
    PAUSED = 'paused',
    RESUMED = 'resumed',
    // GAME_OVER = 'game_over',
    // TIME_OUT = 'time_out',
}

export enum ErrorValues {
    NO_CARD_VALUE = -1,
    NO_CARD_INDEX = -1,
}

// return array.sort(() => Math.random() - 0.5);
export function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function getRandomIntInclusive(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}