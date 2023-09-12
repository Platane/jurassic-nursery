export type Touche = { pageX: number; pageY: number; button?: number };
export type Handler = (touches: Touche[]) => void;
