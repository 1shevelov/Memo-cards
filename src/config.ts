export interface ICardForm {
    name: string;
    x: number;
    y: number;
}

export const CardForms: ICardForm[] = [
    { name: 'Square', x: 1, y: 1 },
    { name: 'Portrait', x: 1, y: 2 },
    { name: 'Landscape', x: 2, y: 1 },
];

export enum GameEvents {
    CARD_FLIPPED = 'card_flipped',
    CARDS_NOT_MATCHED = 'cards_not_matched',
    CARDS_MATCHED = 'cards_matched',
}

export enum ErrorValues {
    NO_CARD_VALUE = -1,
    NO_CARD_INDEX = -1,
    // CARD_ALREADY_FLIPPED = 'Card is already flipped',
}