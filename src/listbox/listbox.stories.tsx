import React, { useState } from "react";
import { Listbox, ListboxOption } from "./";

export default {
  title: "Listbox",
  component: Listbox,
};

const CAR_COMPANIES = [
  { name: "BMW Group", value: "bmw" },
  { name: "Daimler AG", value: "daimlier" },
  { name: "Fiat Chrysler Automobiles", value: "fiat" },
  { name: "Ford Motor Co.", value: "ford" },
  { name: "General Motors Co.", value: "gm" },
  { name: "Honda Motor Company", value: "honda" },
  { name: "Hyundai Motor Group", value: "hyundai" },
  { name: "Mazda Motor Corp.", value: "mazda" },
  { name: "Renault-Nissan-Mitsubishi Alliance", value: "rnm" },
  { name: "Saab AB", value: "saab" },
  { name: "Subaru Corp.", value: "subaru" },
  { name: "Suzuki Motor Corp.", value: "suzuki" },
  { name: "Tata Motors", value: "tata" },
  { name: "Tesla Inc.", value: "tesla" },
  { name: "Toyota Motor Corp.", value: "toyota" },
  { name: "Volkswagen Group", value: "volkswagen" },
  { name: "Zhejiang Geely Holding Group", value: "zg" },
];

export const Uncontrolled = () => {
  const [focusedOption, setFocusedOption] = useState<string>();
  const [selectedOption, setSelectedOption] = useState<string>();

  return (
    <Listbox
      onChange={(option) => setFocusedOption(option)}
      onSelect={(option) => setSelectedOption(option)}
    >
      {CAR_COMPANIES.map((car) => {
        const { name, value } = car;
        const isFocused = value === focusedOption;
        const isSelected = value === selectedOption;
        const style = { background: isFocused ? "#96CCFF" : "" };

        return (
          <ListboxOption key={value} value={value} style={style}>
            {name} {isSelected && String.fromCharCode(10003)}
          </ListboxOption>
        );
      })}
    </Listbox>
  );
};
