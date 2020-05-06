import React, { forwardRef, useRef, createRef, HTMLAttributes } from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { useMergeRefs } from "./useMergeRefs";
import { useFindItemToFocus } from "./useFindItemToFocus";

describe("Hooks", () => {
  describe("useMergeRefs", () => {
    test("merges multiple refs", () => {
      const ref1 = createRef<HTMLButtonElement>();
      const ref2 = createRef<HTMLButtonElement>();
      const Button = forwardRef<
        HTMLButtonElement,
        HTMLAttributes<HTMLButtonElement>
      >((props, ref) => {
        const internalRef = useMergeRefs(ref, ref1);

        return (
          <button {...props} ref={internalRef}>
            click
          </button>
        );
      });
      const { getByText } = render(<Button ref={ref2} />);

      const button = getByText("click");
      expect(ref1.current).toBe(button);
      expect(ref2.current).toBe(button);
    });

    test("calls with the referenced DOM node when function is passed", () => {
      const ref = jest.fn();
      const Comp = () => {
        const mergedRef = useMergeRefs(ref);
        return <button ref={mergedRef}>click</button>;
      };
      const { getByText } = render(<Comp />);
      const button = getByText("click");

      expect(ref).toBeCalledTimes(1);
      expect(ref).toBeCalledWith(button);
    });
  });

  describe("useFindItemFocus", () => {
    test("does not provided callback when the ref is null", () => {
      const onFound = jest.fn();
      const Listbox = () => {
        const listboxRef = useRef<HTMLUListElement>(null);
        const onKeyDown = useFindItemToFocus(listboxRef, onFound);
        return <ul role="listbox" onKeyDown={onKeyDown}></ul>;
      };
      const { getByRole } = render(<Listbox />);
      const listbox = getByRole("listbox");

      fireEvent.keyDown(listbox, { key: "T" });

      expect(onFound).toBeCalledTimes(0);
    });

    test("calls provided callback with the correct option index", () => {
      const onFound = jest.fn();
      const Comp = () => {
        const listboxRef = useRef<HTMLUListElement>(null);
        const onKeyDown = useFindItemToFocus(listboxRef, onFound);
        return (
          <ul role="listbox" ref={listboxRef} onKeyDown={onKeyDown}>
            <li role="option">one</li>
            <li role="option">two</li>
            <li role="option">three</li>
          </ul>
        );
      };
      const { getByRole } = render(<Comp />);
      const listbox = getByRole("listbox");

      fireEvent.keyDown(listbox, { key: "T" });
      fireEvent.keyDown(listbox, { key: "H" });

      expect(onFound).toBeCalledWith(2);
    });
  });
});
