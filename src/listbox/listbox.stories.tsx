import React, { forwardRef, createContext, useRef, HTMLAttributes, createRef, useContext } from "react";
import { Listbox, ListboxOption } from "./"

export default {
  title: "Listbox",
  component: Listbox,
};

export const Example1 = () => (
  <Listbox>
    <ListboxOption>Los Angeles</ListboxOption>
    <ListboxOption>Imperial</ListboxOption>
    <ListboxOption>Riverside</ListboxOption>
    <ListboxOption>San Francisco</ListboxOption>
  </Listbox>
);


// export const Example2 = () => (
//   <Listbox>
//     <ListboxList>
//       <h2>Mexican</h2>
//       <ListboxOption>Tacos</ListboxOption>
//       <ListboxOption>Burritos</ListboxOption>
//       <ListboxOption>Quesadillas</ListboxOption>
//     </ListboxList>
//     <ListboxList>
//       <h2>Italian</h2>
//       <ListboxOption>Pasta</ListboxOption>
//       <ListboxOption>Pizza</ListboxOption>
//       <ListboxOption>Garlic bread</ListboxOption>
//     </ListboxList>
//     <ListboxList>
//       <h2>German</h2>
//       <ListboxOption>Schnitzel</ListboxOption>
//       <ListboxOption>Hamburger</ListboxOption>
//       <ListboxOption>Bratwurst</ListboxOption>
//     </ListboxList>
//   </Listbox>
// );