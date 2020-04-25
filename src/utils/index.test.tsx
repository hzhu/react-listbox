import { SyntheticEvent } from "react";
import { composeEventHandlers } from "./index";

describe("utils", () => {
  test("composeEventHandlers: composes event handlers", () => {
    const event = {} as SyntheticEvent;
    const onClick = jest.fn();
    const onFocus = jest.fn();
    const onKeyDown = jest.fn();
    const composed = composeEventHandlers(onClick, onFocus, onKeyDown);

    composed(event);

    [onClick, onFocus, onKeyDown].forEach((handler) => {
      expect(handler).toBeCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(event);
    });
  });
});
