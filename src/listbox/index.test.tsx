import React, { createRef } from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Listbox, ListboxOption } from "./";
import { LISTBOX_CONTEXT_ERROR } from "./components/Listbox/useListboxContext";
import { KEY_CODES } from "../utils";

export const KEY_EVENTS = {
  ARROW_UP: { keyCode: KEY_CODES.UP, which: KEY_CODES.UP },
  ARROW_DOWN: { keyCode: KEY_CODES.DOWN, which: KEY_CODES.DOWN },
  RETURN: { keyCode: KEY_CODES.RETURN, which: KEY_CODES.RETURN },
};

describe("Listbox", () => {
  test("renders a listbox (snapshot)", () => {
    const { getByRole } = render(
      <Listbox>
        <ListboxOption value="ford">Ford</ListboxOption>
        <ListboxOption value="tesla">Tesla</ListboxOption>
        <ListboxOption value="toyota">Toyota</ListboxOption>
      </Listbox>
    );
    const listbox = getByRole("listbox");

    expect(listbox).toMatchSnapshot();
  });

  test("rendering listbox descendant components outside of context throws error", () => {
    const error = console.error;
    console.error = () => {};

    expect(() =>
      render(<ListboxOption value="tesla">Tesla</ListboxOption>)
    ).toThrow(LISTBOX_CONTEXT_ERROR);

    console.error = error;
  });

  test("forwards ref to the underlying listbox & option elements", () => {
    const listboxRef = createRef<HTMLUListElement>();
    const optionRef = createRef<HTMLLIElement>();
    const { getByRole } = render(
      <Listbox ref={listboxRef}>
        <ListboxOption ref={optionRef} value="tesla">
          Tesla
        </ListboxOption>
      </Listbox>
    );
    expect(listboxRef.current).toBe(getByRole("listbox"));
    expect(optionRef.current).toBe(getByRole("option"));
  });

  test("able to compose and call Listbox onFocus & onKeyDown handler", () => {
    const onFocus = jest.fn();
    const onKeyDown = jest.fn();
    const { getByRole } = render(
      <Listbox onFocus={onFocus} onKeyDown={onKeyDown}>
        <ListboxOption value="tesla">Tesla</ListboxOption>
      </Listbox>
    );
    const listbox = getByRole("listbox");

    expect(onFocus).toBeCalledTimes(0);
    fireEvent.focus(listbox);

    expect(onFocus).toBeCalledTimes(1);
    expect(onKeyDown).toBeCalledTimes(0);

    fireEvent.keyDown(listbox, KEY_EVENTS.ARROW_DOWN);
    expect(onKeyDown).toBeCalledTimes(1);
  });

  test("able to compose and call ListboxOption onClick handler", () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <Listbox>
        <ListboxOption value="tesla" onClick={onClick}>
          Tesla
        </ListboxOption>
      </Listbox>
    );
    const tesla = getByText("Tesla");

    expect(onClick).toBeCalledTimes(0);

    fireEvent.click(tesla);
    expect(onClick).toBeCalledTimes(1);
  });

  describe("Uncontrolled Usage", () => {
    test("single-select: selecting an option sets the correct aria-activedescendant", () => {
      const { getByRole, getByText } = render(
        <Listbox>
          <ListboxOption value="ford">Ford</ListboxOption>
          <ListboxOption value="tesla">Tesla</ListboxOption>
          <ListboxOption value="toyota">Toyota</ListboxOption>
        </Listbox>
      );
      const listbox = getByRole("listbox");
      const ford = getByText("Ford");
      const tesla = getByText("Tesla");

      expect(listbox).not.toHaveAttribute("aria-activedescendant");

      fireEvent.focus(listbox);
      expect(listbox).toHaveAttribute("aria-activedescendant", ford.id);

      fireEvent.keyDown(listbox, KEY_EVENTS.ARROW_DOWN);
      expect(listbox).toHaveAttribute("aria-activedescendant", tesla.id);

      fireEvent.keyDown(listbox, KEY_EVENTS.ARROW_UP);
      expect(listbox).toHaveAttribute("aria-activedescendant", ford.id);
    });

    test("multi-select: selecting an option sets the correct aria-activedescendant", () => {
      const { getByRole, getByText } = render(
        <Listbox multiselect>
          <ListboxOption value="ford">Ford</ListboxOption>
          <ListboxOption value="tesla">Tesla</ListboxOption>
          <ListboxOption value="toyota">Toyota</ListboxOption>
        </Listbox>
      );
      const listbox = getByRole("listbox");
      const ford = getByText("Ford");
      const tesla = getByText("Tesla");
      const toyota = getByText("Toyota");

      expect(listbox).not.toHaveAttribute("aria-activedescendant");

      fireEvent.focus(listbox);
      expect(listbox).toHaveAttribute("aria-activedescendant", ford.id);

      fireEvent.keyDown(listbox, KEY_EVENTS.ARROW_DOWN);
      expect(listbox).toHaveAttribute("aria-activedescendant", tesla.id);

      fireEvent.click(toyota);
      expect(listbox).toHaveAttribute("aria-activedescendant", toyota.id);

      fireEvent.keyDown(listbox, KEY_EVENTS.ARROW_UP);
      expect(listbox).toHaveAttribute("aria-activedescendant", tesla.id);
    });

    test("single-select: selects and deselects options", () => {
      const { getAllByRole } = render(
        <Listbox>
          <ListboxOption value="ford">Ford</ListboxOption>
          <ListboxOption value="tesla">Tesla</ListboxOption>
          <ListboxOption value="toyota">Toyota</ListboxOption>
        </Listbox>
      );

      getAllByRole("option").forEach((option) => {
        expect(option).toHaveAttribute("aria-selected", "false");
        fireEvent.click(option);
        expect(option).toHaveAttribute("aria-selected", "true");
        fireEvent.click(option);
      });
    });

    test("multi-select: selects and deselects all options", () => {
      const { getAllByRole } = render(
        <Listbox multiselect>
          <ListboxOption value="ford">Ford</ListboxOption>
          <ListboxOption value="tesla">Tesla</ListboxOption>
          <ListboxOption value="toyota">Toyota</ListboxOption>
        </Listbox>
      );

      getAllByRole("option").forEach((option) => {
        fireEvent.click(option);
        expect(option).toHaveAttribute("aria-selected", "true");
      });

      getAllByRole("option").forEach((option) => {
        fireEvent.click(option);
        expect(option).toHaveAttribute("aria-selected", "false");
      });
    });

    test("single-select: calls the onChange & onSelect prop with option's value for keyboard selection", () => {
      const onChange = jest.fn();
      const onSelect = jest.fn();
      const { getByText, getByRole } = render(
        <Listbox onSelect={onSelect} onChange={onChange}>
          <ListboxOption value="ford">Ford</ListboxOption>
          <ListboxOption value="tesla">Tesla</ListboxOption>
          <ListboxOption value="toyota">Toyota</ListboxOption>
        </Listbox>
      );
      const ford = getByText("Ford");
      const tesla = getByText("Tesla");
      const listbox = getByRole("listbox");
      const OPTIONS = {
        ford: { id: ford.id, index: 0, value: "ford" },
        tesla: { id: tesla.id, index: 1, value: "tesla" },
      };

      expect(onChange).toBeCalledTimes(0);

      fireEvent.focus(listbox);

      expect(onChange).toBeCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(OPTIONS.ford);
      expect(onSelect).toBeCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(OPTIONS.ford);

      fireEvent.keyDown(listbox, KEY_EVENTS.ARROW_DOWN);

      expect(onChange).toBeCalledTimes(2);
      expect(onChange).toHaveBeenCalledWith(OPTIONS.tesla);
      expect(onSelect).toBeCalledTimes(2);
      expect(onSelect).toHaveBeenCalledWith(OPTIONS.tesla);

      fireEvent.keyDown(listbox, KEY_EVENTS.ARROW_UP);

      expect(onChange).toBeCalledTimes(3);
      expect(onChange).toHaveBeenCalledWith(OPTIONS.ford);
      expect(onSelect).toBeCalledTimes(3);
      expect(onSelect).toHaveBeenCalledWith(OPTIONS.ford);
    });

    test("multi-select: calls the onChange & onSelect prop with correct arguments for keyboard selection", () => {
      const onChange = jest.fn();
      const onSelect = jest.fn();
      const { getByText, getByRole } = render(
        <Listbox multiselect onSelect={onSelect} onChange={onChange}>
          <ListboxOption value="ford">Ford</ListboxOption>
          <ListboxOption value="tesla">Tesla</ListboxOption>
          <ListboxOption value="toyota">Toyota</ListboxOption>
        </Listbox>
      );
      const listbox = getByRole("listbox");
      const ford = getByText("Ford");
      const tesla = getByText("Tesla");
      const OPTIONS = {
        ford: { id: ford.id, index: 0, value: "ford" },
        tesla: { id: tesla.id, index: 1, value: "tesla" },
      };

      expect(onChange).toBeCalledTimes(0);
      expect(onSelect).toBeCalledTimes(1);

      fireEvent.focus(listbox);

      expect(onChange).toBeCalledTimes(1);
      expect(onSelect).toBeCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(OPTIONS.ford);

      fireEvent.keyDown(listbox, KEY_EVENTS.ARROW_DOWN);

      expect(onChange).toBeCalledTimes(2);
      expect(onSelect).toBeCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(OPTIONS.tesla);

      fireEvent.keyDown(listbox, KEY_EVENTS.RETURN);

      expect(onChange).toBeCalledTimes(2);
      expect(onSelect).toBeCalledTimes(2);
      expect(onChange).toHaveBeenCalledWith(OPTIONS.tesla);
      expect(onSelect).toHaveBeenCalledWith({ tesla: OPTIONS.tesla });

      fireEvent.keyDown(listbox, KEY_EVENTS.ARROW_UP);
      fireEvent.keyDown(listbox, KEY_EVENTS.RETURN);

      expect(onChange).toBeCalledTimes(3);
      expect(onSelect).toBeCalledTimes(3);
      expect(onChange).toHaveBeenCalledWith(OPTIONS.ford);
      expect(onSelect).toHaveBeenCalledWith({
        tesla: OPTIONS.tesla,
        ford: OPTIONS.ford,
      });
    });

    test("single-select: calls the onChange & onSelect prop with option's value for click selection", () => {
      const onChange = jest.fn();
      const onSelect = jest.fn();
      const { getByText } = render(
        <Listbox onSelect={onSelect} onChange={onChange}>
          <ListboxOption value="tesla">Tesla</ListboxOption>
        </Listbox>
      );
      const tesla = getByText("Tesla");
      const TESLA_OPTION = { id: tesla.id, index: 0, value: "tesla" };

      expect(onChange).toBeCalledTimes(0);

      fireEvent.click(tesla);

      expect(onChange).toBeCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(TESLA_OPTION);
      expect(onSelect).toBeCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(TESLA_OPTION);
    });

    test("multi-select: calls the onChange & onSelect prop with correct argumentsguments for click selection", () => {
      const onChange = jest.fn();
      const onSelect = jest.fn();
      const { getByText } = render(
        <Listbox multiselect onSelect={onSelect} onChange={onChange}>
          <ListboxOption value="tesla">Tesla</ListboxOption>
          <ListboxOption value="toyota">Toyota</ListboxOption>
        </Listbox>
      );
      const tesla = getByText("Tesla");
      const toyota = getByText("Toyota");
      const SELECTED_OPTIONS = {
        tesla: { id: tesla.id, index: 0, value: "tesla" },
        toyota: { id: toyota.id, index: 1, value: "toyota" },
      };

      expect(onChange).toBeCalledTimes(0);
      expect(onSelect).toBeCalledTimes(1);

      fireEvent.click(tesla);
      fireEvent.click(toyota);

      expect(onSelect).toBeCalledTimes(3);
      expect(onSelect).toHaveBeenCalledWith(SELECTED_OPTIONS);
    });
  });

  describe("Controlled Usage", () => {
    test("calls onChange with the correct option on keyboard selection", () => {
      const onChange = jest.fn();
      const controlledIndex = 1;
      const { getByText, getByRole } = render(
        <Listbox focusedIndex={controlledIndex} onChange={onChange}>
          <ListboxOption value="ford">Ford</ListboxOption>
          <ListboxOption value="tesla">Tesla</ListboxOption>
          <ListboxOption value="toyota">Toyota</ListboxOption>
        </Listbox>
      );
      const listbox = getByRole("listbox");
      const toyota = getByText("Toyota");
      const ford = getByText("Ford");

      expect(onChange).toHaveBeenCalledTimes(0);

      fireEvent.keyDown(listbox, KEY_EVENTS.ARROW_DOWN);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith({
        id: toyota.id,
        index: controlledIndex + 1,
        value: "toyota",
      });

      fireEvent.keyDown(listbox, KEY_EVENTS.ARROW_UP);

      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenCalledWith({
        id: ford.id,
        index: controlledIndex - 1,
        value: "ford",
      });
    });

    test("calls onChange with the correct option on pointer selection", () => {
      const onChange = jest.fn();
      const { getByText } = render(
        <Listbox focusedIndex={0} onChange={onChange}>
          <ListboxOption value="ford">Ford</ListboxOption>
          <ListboxOption value="tesla">Tesla</ListboxOption>
          <ListboxOption value="toyota">Toyota</ListboxOption>
        </Listbox>
      );
      const ford = getByText("Ford");
      const tesla = getByText("Tesla");
      const toyota = getByText("Toyota");
      const OPTIONS_BY_ID = {
        [ford.id]: { id: ford.id, index: 0, value: "ford" },
        [tesla.id]: { id: tesla.id, index: 1, value: "tesla" },
        [toyota.id]: { id: toyota.id, index: 2, value: "toyota" },
      };

      [toyota, tesla, ford].forEach((option) => {
        fireEvent.click(option);
        expect(onChange).toHaveBeenCalledWith(OPTIONS_BY_ID[option.id]);
      });
    });

    test("calls onSelect with the correct option on keyboard selection", () => {
      const onSelect = jest.fn();
      const controlledFocusedIndex = 1;
      const { getByText, getByRole } = render(
        <Listbox focusedIndex={controlledFocusedIndex} onSelect={onSelect}>
          <ListboxOption value="ford">Ford</ListboxOption>
          <ListboxOption value="tesla">Tesla</ListboxOption>
          <ListboxOption value="toyota">Toyota</ListboxOption>
        </Listbox>
      );
      const listbox = getByRole("listbox");
      const tesla = getByText("Tesla");

      fireEvent.keyDown(listbox, KEY_EVENTS.RETURN);

      expect(onSelect).toBeCalledTimes(1);
      expect(onSelect).toBeCalledWith({
        id: tesla.id,
        index: controlledFocusedIndex,
        value: "tesla",
      });
    });

    test("calls onSelect with the correct option on pointer selection", () => {
      const onSelect = jest.fn();
      const controlledFocusedIndex = 1;
      const { getByText } = render(
        <Listbox focusedIndex={controlledFocusedIndex} onSelect={onSelect}>
          <ListboxOption value="ford">Ford</ListboxOption>
          <ListboxOption value="tesla">Tesla</ListboxOption>
          <ListboxOption value="toyota">Toyota</ListboxOption>
        </Listbox>
      );
      const ford = getByText("Ford");
      const tesla = getByText("Tesla");
      const toyota = getByText("Toyota");
      const OPTIONS_BY_ID = {
        [ford.id]: { id: ford.id, index: 0, value: "ford" },
        [tesla.id]: { id: tesla.id, index: 1, value: "tesla" },
        [toyota.id]: { id: toyota.id, index: 2, value: "toyota" },
      };

      [ford, tesla, toyota].forEach((option) => {
        fireEvent.click(option);
        expect(onSelect).toBeCalledWith(OPTIONS_BY_ID[option.id]);
      });
    });
  });
});
