import { useRef, useEffect, SyntheticEvent } from "react";

export const KEY_CODES: Record<string, number> = {
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
};

export type Handlers = (Function | undefined)[];

export const composeEventHandlers = (...handlers: Handlers) => (
  e: SyntheticEvent
) => {
  handlers.forEach((handler) => handler && handler(e));
};

export const useDidMountEffect = (func: Function, deps: any[]) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      func();
    } else {
      didMount.current = true;
    }
  }, deps);
};