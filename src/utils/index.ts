import { SyntheticEvent } from "react";

export type KEY =
  | "BACKSPACE"
  | "TAB"
  | "RETURN"
  | "ESC"
  | "SPACE"
  | "PAGE_UP"
  | "PAGE_DOWN"
  | "END"
  | "HOME"
  | "LEFT"
  | "UP"
  | "RIGHT"
  | "DOWN"
  | "DELETE"
  | "SHIFT";

export const KEY_CODES: Record<KEY, number> = {
  BACKSPACE: 8,
  TAB: 9,
  RETURN: 13,
  ESC: 27,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  DELETE: 46,
  SHIFT: 16,
};

export type Handlers = (Function | undefined)[];

export const composeEventHandlers = (...handlers: Handlers) => (
  e: SyntheticEvent
) => {
  handlers.forEach((handler) => handler && handler(e));
};

export const focusElement = (
  element: HTMLElement | null,
  container: HTMLUListElement | null
) => {
  if (element === null || container === null) return;

  const scrollBottom = container.clientHeight + container.scrollTop;
  const elementBottom = element.offsetTop + element.offsetHeight;
  if (elementBottom > scrollBottom) {
    /* istanbul ignore next */
    container.scrollTop = elementBottom - container.clientHeight;
  } else if (element.offsetTop < container.scrollTop) {
    /* istanbul ignore next */
    container.scrollTop = element.offsetTop;
  }
};
