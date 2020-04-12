import React from "react";
import { render, fireEvent } from "@testing-library/react";
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
  describe("Uncontrolled", () => {
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

      fireEvent.focus(listbox);
      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.DOWN,
        which: KEY_CODES.DOWN,
      });

      expect(onChange).toHaveBeenCalledWith("tesla");
      expect(onChange).toBeCalledTimes(1);
      expect(onSelect).toBeCalledTimes(0);

      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.DOWN,
        which: KEY_CODES.DOWN,
      });

      expect(onChange).toHaveBeenCalledWith("tesla");
      expect(onChange).toBeCalledTimes(2);
      expect(onSelect).toBeCalledTimes(0);

      fireEvent.keyDown(listbox, {
        keyCode: KEY_CODES.RETURN,
        which: KEY_CODES.RETURN,
      });

      expect(onChange).toBeCalledTimes(2);
      expect(onChange).toHaveBeenCalledWith("tesla");
      expect(onSelect).toBeCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith("toyota");
    });
    test("calls the onChange & onSelect prop with option's value for click selection", () => {
      const onChange = jest.fn();
      const onSelect = jest.fn();
      const { getByText } = render(
        <Listbox onSelect={onSelect} onChange={onChange}>
          <ListboxOption value="ford">Ford</ListboxOption>
          <ListboxOption value="tesla">Tesla</ListboxOption>
          <ListboxOption value="toyota">Toyota</ListboxOption>
        </Listbox>
      );
      const tesla = getByText("Tesla");

      fireEvent.click(tesla);

      expect(onChange).toBeCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith("tesla");
      expect(onSelect).toBeCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith("tesla");
    });
  });
});
