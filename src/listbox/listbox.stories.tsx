import React from "react";
import { action } from "@storybook/addon-actions";
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

export const Uncontrolled = () => (
  <Listbox onSelect={(item) => console.log(item)}>
    {CAR_COMPANIES.map((car) => (
      <ListboxOption id={car.value} value={car.value}>
        {car.name}
      </ListboxOption>
    ))}
  </Listbox>
);
