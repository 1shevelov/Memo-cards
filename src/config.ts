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