import { Draggable } from "../entities/triceratops";

export const state = {
  t: 0,

  selectedTriceratopsId: null as null | number,

  dragged: null as null | Draggable,
};
