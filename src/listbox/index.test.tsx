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

  test("able to composes and call ListboxOption's onClick handler", () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <Listbox>
        <ListboxOption value="tesla" onClick={onClick}>
          Tesla
        </ListboxOption>
      </Listbox>
    );
    const tesla = getByText("Tesla");

    fireEvent.click(tesla);

    expect(onClick).toBeCalledTimes(1);
  });

  describe("Uncontrolled", () => {
    test("selecting an option sets the correct aria-activedescendant and aria-selected", () => {
      const { getByRole, getByText } = render(
        <Listbox>
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

      expect(tesla).not.toHaveAttribute("aria-selected");
      expect(listbox).not.toHaveAttribute("aria-activedescendant");

      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.RETURN,
        which: KEY_CODES.RETURN,
      });

      expect(tesla).toHaveAttribute("aria-selected", "true");
      expect(listbox).toHaveAttribute("aria-activedescendant", tesla.id);

      fireEvent.click(toyota);

      expect(tesla).not.toHaveAttribute("aria-selected");
      expect(toyota).toHaveAttribute("aria-selected", "true");
      expect(listbox).toHaveAttribute("aria-activedescendant", toyota.id);

      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.UP,
        which: KEY_CODES.UP,
      });

      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.RETURN,
        which: KEY_CODES.RETURN,
      });

      expect(toyota).not.toHaveAttribute("aria-selected");
      expect(tesla).toHaveAttribute("aria-selected", "true");
      expect(listbox).toHaveAttribute("aria-activedescendant", tesla.id);
    });

    test("calls the onChange & onSelect prop with option's value for keyboard selection", () => {
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

      expect(onChange).toBeCalledTimes(0);

      fireEvent.focus(listbox);

      expect(onChange).toBeCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith("ford");

      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.DOWN,
        which: KEY_CODES.DOWN,
      });

      expect(onChange).toHaveBeenCalledWith("tesla");
      expect(onChange).toBeCalledTimes(2);
      expect(onSelect).toBeCalledTimes(0);

      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.DOWN,
        which: KEY_CODES.DOWN,
      });

      expect(onChange).toHaveBeenCalledWith("tesla");
      expect(onChange).toBeCalledTimes(3);
      expect(onSelect).toBeCalledTimes(0);

      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.RETURN,
        which: KEY_CODES.RETURN,
      });

      expect(onChange).toBeCalledTimes(3);
      expect(onChange).toHaveBeenCalledWith("tesla");
      expect(onSelect).toBeCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith("toyota");
    });
    test("calls the onChange & onSelect prop with option's value for click selection", () => {
      const onChange = jest.fn();
      const onSelect = jest.fn();
      const { getByText } = render(
        <Listbox onSelect={onSelect} onChange={onChange}>
          <ListboxOption value="tesla">Tesla</ListboxOption>
        </Listbox>
      );
      const tesla = getByText("Tesla");

      fireEvent.click(tesla);

      expect(onChange).toBeCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith("tesla");
      expect(onSelect).toBeCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith("tesla");
    });

    test("able to composes and call ListboxOption's onClick handler", () => {
      const onClick = jest.fn();
      const { getByText } = render(
        <Listbox>
          <ListboxOption value="tesla" onClick={onClick}>
            Tesla
          </ListboxOption>
        </Listbox>
      );
      const tesla = getByText("Tesla");

      fireEvent.click(tesla);

      expect(onClick).toBeCalledTimes(1);
    });
  });
});
