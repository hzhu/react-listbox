import React from "react";
import { render } from "@testing-library/react";
import { Listbox, ListboxOption } from "./";

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
