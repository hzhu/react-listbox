import React, { forwardRef, createRef, HTMLAttributes } from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { useMergeRefs } from "./useMergeRefs";

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
});
