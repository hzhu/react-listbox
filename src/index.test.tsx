import React, { useState, createRef } from "react";
import { render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { Listbox } from "./components/Listbox";
import { ListboxGroup } from "./components/ListboxGroup";
import { ListboxOption } from "./components/ListboxOption";
import { LISTBOX_CONTEXT_ERROR } from "./hooks/useListboxContext";
import { KEY_CODES } from "./utils";

export const KEY_EVENTS = {
  ARROW_UP: { keyCode: KEY_CODES.UP, which: KEY_CODES.UP },
  ARROW_DOWN: { keyCode: KEY_CODES.DOWN, which: KEY_CODES.DOWN },
  RETURN: { keyCode: KEY_CODES.RETURN, which: KEY_CODES.RETURN },
  HOME: { keyCode: KEY_CODES.HOME, which: KEY_CODES.HOME },
  END: { keyCode: KEY_CODES.END, which: KEY_CODES.END },
  TAB: { keyCode: KEY_CODES.TAB, which: KEY_CODES.TAB },
  SHIFT: { keyCode: KEY_CODES.SHIFT, which: KEY_CODES.SHIFT },
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
    test("uses a defaultIndex to preset uncontrolled state", () => {
      const { getByText } = render(
        <Listbox defaultSelectedIndex={1}>
          <ListboxOption value="ford">Ford</ListboxOption>
          <ListboxOption value="tesla">Tesla</ListboxOption>
          <ListboxOption value="toyota">Toyota</ListboxOption>
        </Listbox>
      );
      const tesla = getByText("Tesla");

      expect(tesla).toHaveAttribute("aria-selected", "true");
      userEvent.tab();
      expect(tesla).toHaveAttribute("aria-selected", "true");
    });
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

    test("can move focus from listbox to next (tab) & previous (shift+tab) element", () => {
      const { getByRole, getByText } = render(
        <>
          <button>Taco</button>
          <Listbox>
            <ListboxOption value="ford">Ford</ListboxOption>
            <ListboxOption value="tesla">Tesla</ListboxOption>
            <ListboxOption value="toyota">Toyota</ListboxOption>
          </Listbox>
          <button>Burger</button>
        </>
      );
      const listbox = getByRole("listbox");
      const taco = getByText("Taco");
      const burger = getByText("Burger");

      expect(document.body).toHaveFocus();

      userEvent.tab();
      userEvent.tab();

      expect(listbox).toHaveFocus();

      userEvent.tab();

      expect(burger).toHaveFocus();

      userEvent.tab({ shift: true });
      userEvent.tab({ shift: true });

      expect(taco).toHaveFocus();
    });

    test("multi-select: selecting an option sets the correct aria-activedescendant", () => {
      const { getByRole, getByText } = render(
        <Listbox multiSelect>
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
        <Listbox multiSelect>
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
        <Listbox multiSelect onSelect={onSelect} onChange={onChange}>
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
        <Listbox multiSelect onSelect={onSelect} onChange={onChange}>
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

    test("type a character: selects and focuses the next option that starts with the typed character", () => {
      const onChange = jest.fn();
      const onSelect = jest.fn();
      const { getByText, getByRole } = render(
        <Listbox onSelect={onSelect} onChange={onChange}>
          <ListboxOption value="bmw">BMW</ListboxOption>
          <ListboxOption value="ford">Ford</ListboxOption>
          <ListboxOption value="tesla">Tesla</ListboxOption>
          <ListboxOption value="toyota">Toyota</ListboxOption>
        </Listbox>
      );
      const bmw = getByText("BMW");
      const tesla = getByText("Tesla");
      const listbox = getByRole("listbox");

      expect(onChange).toBeCalledTimes(0);
      expect(onSelect).toBeCalledTimes(0);
      expect(listbox).not.toHaveAttribute("aria-activedescendant");

      fireEvent.focus(listbox);
      expect(onChange).toBeCalledTimes(1);
      expect(onChange).toBeCalledWith({
        id: bmw.id,
        index: 0,
        value: "bmw",
      });
      expect(listbox).toHaveAttribute("aria-activedescendant", bmw.id);
      expect(onSelect).toBeCalledTimes(1);
      expect(onSelect).toBeCalledWith({
        id: bmw.id,
        index: 0,
        value: "bmw",
      });

      fireEvent.keyDown(listbox, { key: "T" });
      expect(onChange).toBeCalledTimes(2);
      expect(onChange).toBeCalledWith({
        id: tesla.id,
        index: 2,
        value: "tesla",
      });
      expect(listbox).toHaveAttribute("aria-activedescendant", tesla.id);
      expect(onSelect).toBeCalledTimes(2);
      expect(onSelect).toBeCalledWith({
        id: tesla.id,
        index: 2,
        value: "tesla",
      });
    });

    test("type multiple characters in rapid succession: focus moves to next item with a name that starts with the string of characters typed.", () => {
      jest.useFakeTimers();
      const onChange = jest.fn();
      const onSelect = jest.fn();
      const { getByText, getByRole } = render(
        <Listbox onSelect={onSelect} onChange={onChange}>
          <ListboxOption value="bmw">BMW</ListboxOption>
          <ListboxOption value="ford">Ford</ListboxOption>
          <ListboxOption value="tesla">Tesla</ListboxOption>
          <ListboxOption value="toyota">Toyota</ListboxOption>
        </Listbox>
      );
      const listbox = getByRole("listbox");
      const toyota = getByText("Toyota");
      const bmw = getByText("BMW");

      fireEvent.focus(listbox);
      fireEvent.keyDown(listbox, { key: "T" });
      fireEvent.keyDown(listbox, { key: "O" });

      expect(onChange).toBeCalledWith({
        id: toyota.id,
        index: 3,
        value: "toyota",
      });
      expect(onSelect).toBeCalledWith({
        id: toyota.id,
        index: 3,
        value: "toyota",
      });
      expect(listbox).toHaveAttribute("aria-activedescendant", toyota.id);

      // Fast-forward until all timers have been executed
      jest.runAllTimers();

      fireEvent.keyDown(listbox, { key: "B" });

      expect(onSelect).toBeCalledWith({
        id: bmw.id,
        index: 0,
        value: "bmw",
      });
      expect(listbox).toHaveAttribute("aria-activedescendant", bmw.id);
    });

    test("focuses and selects the first/last option when HOME/END key is pressed", () => {
      const onChange = jest.fn();
      const onSelect = jest.fn();
      const { getByRole, getByText } = render(
        <Listbox onChange={onChange} onSelect={onSelect}>
          <ListboxOption value="bmw">BMW</ListboxOption>
          <ListboxOption value="ford">Ford</ListboxOption>
          <ListboxOption value="tesla">Tesla</ListboxOption>
          <ListboxOption value="toyota">Toyota</ListboxOption>
        </Listbox>
      );
      const listbox = getByRole("listbox");
      const bmw = getByText("BMW");
      const toyota = getByText("Toyota");
      const firstOption = { id: bmw.id, index: 0, value: "bmw" };
      const lastOption = { id: toyota.id, index: 3, value: "toyota" };
      expect(bmw).toHaveAttribute("aria-selected", "false");
      expect(toyota).toHaveAttribute("aria-selected", "false");
      expect(onChange).toHaveBeenCalledTimes(0);
      expect(onSelect).toHaveBeenCalledTimes(0);

      fireEvent.keyDown(listbox, KEY_EVENTS.HOME);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(firstOption);
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(firstOption);
      expect(bmw).toHaveAttribute("aria-selected", "true");

      fireEvent.keyDown(listbox, KEY_EVENTS.END);
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenCalledWith(lastOption);
      expect(onSelect).toHaveBeenCalledTimes(2);
      expect(onSelect).toHaveBeenCalledWith(lastOption);
      expect(toyota).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Controlled Usage", () => {
    test("sets the correct aria-activedescendant attribute", () => {
      const INITIAL_FOCUSED_INDEX = 1;
      const { getByRole, getByText } = render(
        <>
          <Listbox focusedIndex={INITIAL_FOCUSED_INDEX}>
            <ListboxOption value="ford">Ford</ListboxOption>
            <ListboxOption value="tesla">Tesla</ListboxOption>
            <ListboxOption value="toyota">Toyota</ListboxOption>
          </Listbox>
        </>
      );
      const tesla = getByText("Tesla");
      const listbox = getByRole("listbox");

      expect(listbox).toHaveAttribute("aria-activedescendant", tesla.id);
    });

    test("can move focus from listbox to next (tab) & previous (shift+tab) element", () => {
      const INITIAL_FOCUSED_INDEX = 1;
      const { getByRole, getByText } = render(
        <>
          <button>Taco</button>
          <Listbox focusedIndex={INITIAL_FOCUSED_INDEX}>
            <ListboxOption value="ford">Ford</ListboxOption>
            <ListboxOption value="tesla">Tesla</ListboxOption>
            <ListboxOption value="toyota">Toyota</ListboxOption>
          </Listbox>
          <button>Burger</button>
        </>
      );
      const listbox = getByRole("listbox");
      const taco = getByText("Taco");
      const burger = getByText("Burger");

      expect(document.body).toHaveFocus();

      userEvent.tab();
      userEvent.tab();

      expect(listbox).toHaveFocus();

      userEvent.tab();

      expect(burger).toHaveFocus();

      userEvent.tab({ shift: true });
      userEvent.tab({ shift: true });

      expect(taco).toHaveFocus();
    });

    test("sets the correct aria-selected attribute", () => {
      const Basic = () => {
        const INITIAL_SELECTED_INDEX = 1;
        const ALL_INDICES = [0, INITIAL_SELECTED_INDEX, 2];
        const [controlledIndex, setControlledIndex] = useState<
          number | number[]
        >(INITIAL_SELECTED_INDEX);
        const onSelectAll = () => setControlledIndex(ALL_INDICES);

        return (
          <>
            <Listbox selectedIndex={controlledIndex}>
              <ListboxOption value="ford">Ford</ListboxOption>
              <ListboxOption value="tesla">Tesla</ListboxOption>
              <ListboxOption value="toyota">Toyota</ListboxOption>
            </Listbox>
            <button onClick={onSelectAll}>Select All</button>
          </>
        );
      };
      const { getByText } = render(<Basic />);
      const ford = getByText("Ford");
      const tesla = getByText("Tesla");
      const toyota = getByText("Toyota");
      const selectAll = getByText("Select All");

      expect(tesla).toHaveAttribute("aria-selected", "true");

      fireEvent.click(selectAll);

      expect(ford).toHaveAttribute("aria-selected", "true");
      expect(tesla).toHaveAttribute("aria-selected", "true");
      expect(toyota).toHaveAttribute("aria-selected", "true");
    });

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
      const controlledIndex = 1;
      const { getByText, getByRole } = render(
        <Listbox onSelect={onSelect} focusedIndex={controlledIndex}>
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
        index: controlledIndex,
        value: "tesla",
      });
    });

    test("calls onSelect with the correct option on alphanumeric key selection", () => {
      const onSelect = jest.fn();
      const controlledIndex = 1;
      const { getByText, getByRole } = render(
        <Listbox onSelect={onSelect} focusedIndex={controlledIndex}>
          <ListboxOption value="ford">Ford</ListboxOption>
          <ListboxOption value="tesla">Tesla</ListboxOption>
          <ListboxOption value="toyota">Toyota</ListboxOption>
        </Listbox>
      );
      const listbox = getByRole("listbox");
      const tesla = getByText("Tesla");

      fireEvent.keyDown(listbox, { key: "T" });

      expect(onSelect).toBeCalledTimes(1);
      expect(onSelect).toBeCalledWith({
        id: tesla.id,
        index: controlledIndex,
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

  describe("Grouped Listbox", () => {
    test("correctly associates a group to an label", () => {
      const { getAllByRole, getByText } = render(
        <Listbox>
          <ListboxGroup label={<span>United States</span>}>
            <ListboxOption value="ford">Ford</ListboxOption>
            <ListboxOption value="tesla">Tesla</ListboxOption>
          </ListboxGroup>
          <ListboxGroup label={<span>Germany</span>}>
            <ListboxOption value="bmw">BMW</ListboxOption>
            <ListboxOption value="daimler">Daimler AG</ListboxOption>
          </ListboxGroup>
        </Listbox>
      );
      const usa = getByText("United States");
      const de = getByText("Germany");
      const groups = getAllByRole("group");

      expect(groups[0]).toHaveAttribute("aria-labelledby", usa.id);
      expect(groups[1]).toHaveAttribute("aria-labelledby", de.id);
    });

    test("can select an option from a grouped listbox", () => {
      const onChange = jest.fn();
      const { getByRole, getByText } = render(
        <Listbox onChange={onChange}>
          <ListboxGroup label={<span>United States</span>}>
            <ListboxOption value="ford">Ford</ListboxOption>
            <ListboxOption value="tesla">Tesla</ListboxOption>
          </ListboxGroup>
          <ListboxGroup label={<span>Germany</span>}>
            <ListboxOption value="bmw">BMW</ListboxOption>
            <ListboxOption value="daimler">Daimler AG</ListboxOption>
          </ListboxGroup>
        </Listbox>
      );
      const listbox = getByRole("listbox");
      const ford = getByText("Ford");
      const tesla = getByText("Tesla");
      const bmw = getByText("BMW");

      const OPTIONS = {
        ford: { id: ford.id, index: 0, value: "ford" },
        tesla: { id: tesla.id, index: 1, value: "tesla" },
        bmw: { id: bmw.id, index: 2, value: "bmw" },
      };

      expect(onChange).toBeCalledTimes(0);

      fireEvent.click(ford);
      expect(onChange).toBeCalledWith(OPTIONS.ford);

      fireEvent.keyDown(listbox, KEY_EVENTS.ARROW_DOWN);
      expect(onChange).toBeCalledWith(OPTIONS.tesla);

      fireEvent.keyDown(listbox, KEY_EVENTS.ARROW_DOWN);
      expect(onChange).toBeCalledWith(OPTIONS.bmw);

      expect(onChange).toBeCalledTimes(3);
    });
  });
});
