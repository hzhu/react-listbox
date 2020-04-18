import React, { createRef } from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Listbox, ListboxOption } from "./";
import { KEY_CODES } from "../utils";

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

    fireEvent.keyDown(listbox, {
      keyCode: KEY_CODES.DOWN,
      which: KEY_CODES.DOWN,
    });

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

  describe("Uncontrolled", () => {
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

      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.DOWN,
        which: KEY_CODES.DOWN,
      });

      expect(listbox).toHaveAttribute("aria-activedescendant", tesla.id);

      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.UP,
        which: KEY_CODES.UP,
      });

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
      const tesla = getByText("Tesla");
      const toyota = getByText("Toyota");

      fireEvent.focus(listbox);

      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.DOWN,
        which: KEY_CODES.DOWN,
      });

      expect(listbox).not.toHaveAttribute("aria-activedescendant");

      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.RETURN,
        which: KEY_CODES.RETURN,
      });

      expect(listbox).toHaveAttribute("aria-activedescendant", tesla.id);

      fireEvent.click(toyota);

      expect(listbox).toHaveAttribute("aria-activedescendant", toyota.id);

      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.UP,
        which: KEY_CODES.UP,
      });

      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.RETURN,
        which: KEY_CODES.RETURN,
      });

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
      const { getByRole } = render(
        <Listbox onSelect={onSelect} onChange={onChange}>
          <ListboxOption value="ford">Ford</ListboxOption>
          <ListboxOption value="tesla">Tesla</ListboxOption>
          <ListboxOption value="toyota">Toyota</ListboxOption>
        </Listbox>
      );
      const listbox = getByRole("listbox");

      // Handlers called once on mount due to useEffect.
      expect(onChange).toBeCalledTimes(1);
      expect(onChange.mock.calls).toEqual([[""]]);

      fireEvent.focus(listbox);

      expect(onChange).toBeCalledTimes(2);
      expect(onChange.mock.calls).toEqual([[""], ["ford"]]);

      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.DOWN,
        which: KEY_CODES.DOWN,
      });

      expect(onChange).toBeCalledTimes(3);
      expect(onChange.mock.calls).toEqual([[""], ["ford"], ["tesla"]]);

      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.RETURN,
        which: KEY_CODES.RETURN,
      });

      expect(onChange).toBeCalledTimes(3);
      expect(onChange.mock.calls).toEqual([[""], ["ford"], ["tesla"]]);
      expect(onSelect).toBeCalledTimes(2);
      expect(onSelect).toHaveBeenCalledWith("tesla");

      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.UP,
        which: KEY_CODES.UP,
      });

      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.RETURN,
        which: KEY_CODES.RETURN,
      });

      expect(onChange).toBeCalledTimes(4);
      expect(onChange.mock.calls).toEqual([
        [""],
        ["ford"],
        ["tesla"],
        ["ford"],
      ]);
      expect(onSelect).toBeCalledTimes(3);
      expect(onSelect).toHaveBeenCalledWith("ford");
    });

    test("multi-select: calls the onChange & onSelect prop with correct arguments for keyboard selection", () => {
      const onChange = jest.fn();
      const onSelect = jest.fn();
      const { getByRole } = render(
        <Listbox multiselect onSelect={onSelect} onChange={onChange}>
          <ListboxOption value="ford">Ford</ListboxOption>
          <ListboxOption value="tesla">Tesla</ListboxOption>
          <ListboxOption value="toyota">Toyota</ListboxOption>
        </Listbox>
      );
      const listbox = getByRole("listbox");

      // Handlers called once on mount due to useEffect.
      expect(onChange).toBeCalledTimes(1);
      expect(onChange.mock.calls).toEqual([[""]]);
      expect(onSelect).toBeCalledTimes(1);

      fireEvent.focus(listbox);

      expect(onChange).toBeCalledTimes(2);
      expect(onChange.mock.calls).toEqual([[""], ["ford"]]);

      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.DOWN,
        which: KEY_CODES.DOWN,
      });

      expect(onChange).toBeCalledTimes(3);
      expect(onChange.mock.calls).toEqual([[""], ["ford"], ["tesla"]]);

      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.RETURN,
        which: KEY_CODES.RETURN,
      });

      expect(onChange).toBeCalledTimes(3);
      expect(onChange.mock.calls).toEqual([[""], ["ford"], ["tesla"]]);
      expect(onSelect).toBeCalledTimes(2);
      expect(onSelect).toHaveBeenCalledWith({ tesla: true });

      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.UP,
        which: KEY_CODES.UP,
      });

      expect(onChange).toBeCalledTimes(4);
      expect(onChange.mock.calls).toEqual([
        [""],
        ["ford"],
        ["tesla"],
        ["ford"],
      ]);

      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.RETURN,
        which: KEY_CODES.RETURN,
      });

      expect(onChange).toBeCalledTimes(4);
      expect(onChange.mock.calls).toEqual([
        [""],
        ["ford"],
        ["tesla"],
        ["ford"],
      ]);
      expect(onSelect).toBeCalledTimes(3);
      expect(onSelect).toHaveBeenCalledWith({ tesla: true, ford: true });
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

      // Handlers called once on mount due to useEffect.
      expect(onChange).toBeCalledTimes(1);

      fireEvent.click(tesla);

      expect(onChange).toBeCalledTimes(2);
      expect(onChange).toHaveBeenCalledWith("tesla");
      expect(onSelect).toBeCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith("tesla");
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

      // Handlers called once on mount due to useEffect.
      expect(onChange).toBeCalledTimes(1);
      expect(onSelect).toBeCalledTimes(1);

      fireEvent.click(tesla);
      fireEvent.click(toyota);

      expect(onSelect).toHaveBeenCalledWith({ tesla: true, toyota: true });
      expect(onSelect).toBeCalledTimes(3);
    });
  });
});
