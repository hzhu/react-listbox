import React, { useState } from "react";
import { Select, List, Option, Button, Label } from "./components";
import "./style.css";

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
  <div className="select-style-example">
    <Select onChange={(option) => console.log(option)}>
      <Label>Select a car:</Label>
      <Button>{CAR_COMPANIES[0].name}</Button>
      <List>
        {CAR_COMPANIES.map((car) => (
          <Option key={car.name} value={car.name}>
            {car.name}
          </Option>
        ))}
      </List>
    </Select>
  </div>
);

Uncontrolled.story = {
  parameters: {
    docs: {
      storyDescription: `An [uncontrolled](https://gist.github.com/ryanflorence/e2fa045ad523f2228d34ce3f94df75b3) component is driven by _state_, while a
      controlled component is driven by _props_. This Select component demonstrates uncontrolled single-select behavior.`,
    },
  },
};

export const Controlled = () => {
  const [index, setIndex] = useState(3);
  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded(!expanded);

  return (
    <div className="select-style-example">
      <Select
        expanded={expanded}
        onChange={(option) => setIndex(option.index as number)}
      >
        <Label>Select a car:</Label>
        <Button onClick={toggle}>{CAR_COMPANIES[index].name}</Button>
        <List onBlur={toggle} selectedIndex={index}>
          {CAR_COMPANIES.map((car) => (
            <Option key={car.name} value={car.name}>
              {car.name}
            </Option>
          ))}
        </List>
      </Select>
    </div>
  );
};

Controlled.story = {
  parameters: {
    docs: {
      storyDescription: `An [controlled](https://gist.github.com/ryanflorence/e2fa045ad523f2228d34ce3f94df75b3) component is driven by _props_, while a
      uncontrolled component is driven by _state_. This Select component demonstrates controlled single-select behavior.`,
    },
  },
};

export default {
  title: "Select",
  component: Select,
  subcomponents: { List, Option, Button, Label },
  parameters: {
    componentSubtitle: `Implemented using the Listbox component.`,
  },
};
