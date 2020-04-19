import React, { useState, SyntheticEvent } from "react";
import { render, fireEvent } from "@testing-library/react";
import { composeEventHandlers, useDidMountEffect } from "./index";

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

  test("useDidMountEffect: runs effect after mount, only when dependency changes", () => {
    const effect = jest.fn();
    const Basic = () => {
      const [count, setCount] = useState(0);
      const increment = () => setCount(count + 1);
      useDidMountEffect(effect, [count]);

      return <button onClick={increment}>click</button>;
    };
    const { getByRole } = render(<Basic />);

    expect(effect).toBeCalledTimes(0);
    fireEvent.click(getByRole("button"));
    expect(effect).toBeCalledTimes(1);
  });
});
