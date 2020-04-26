import React, { useState, useCallback } from "react";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import { Listbox, ListboxOption, SelectedValues, IOption } from "./";

export default {
  title: "Listbox",
  component: Listbox,
  decorators: [withKnobs],
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
  const label = "multiSelect";
  const defaultValue = false;
  const multiSelect = boolean(label, defaultValue);
  const [focusedOption, setFocusedOption] = useState<IOption | undefined>();
  const [selectedOption, setSelectedOption] = useState<
    IOption | SelectedValues
  >({});
  const onChange = useCallback((option) => setFocusedOption(option), []);
  const onSelect = useCallback((option) => setSelectedOption(option), []);

  return (
    <Listbox multiSelect={multiSelect} onChange={onChange} onSelect={onSelect}>
      {CAR_COMPANIES.map((car, index) => {
        const { name, value } = car;
        const isFocused = index === focusedOption?.index;
        const isSelected = multiSelect
          ? value === selectedOption[value]?.value
          : value === selectedOption.value;
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

export const Controlled = () => {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number | number[]>(0);
  const isLast = focusedIndex === CAR_COMPANIES.length - 1;
  const isFirst = focusedIndex === 0;
  const allSelected =
    Array.isArray(selectedIndex) &&
    selectedIndex.length === CAR_COMPANIES.length;
  const noneSelected =
    Array.isArray(selectedIndex) && selectedIndex.length === 0;
  const selectOption = (index: number) => {
    setFocusedIndex(index);
    setSelectedIndex(index);
  };
  const onFirst = () => selectOption(0);
  const onLast = () => selectOption(CAR_COMPANIES.length - 1);
  const onNext = () => {
    if (focusedIndex < CAR_COMPANIES.length - 1) {
      selectOption(focusedIndex + 1);
    }
  };
  const onPrevious = () => {
    if (focusedIndex > 0) {
      selectOption(focusedIndex - 1);
    }
  };
  const onSelectAll = () => {
    const allIndices = [...Array(CAR_COMPANIES.length).keys()];
    setSelectedIndex(allIndices);
  };
  const deselectAll = () => setSelectedIndex([]);
  const buttonGroup = (
    <>
      <button disabled={isFirst} onClick={onFirst}>
        {String.fromCharCode(171)} First
      </button>
      <button disabled={isFirst} onClick={onPrevious}>
        {String.fromCharCode(8249)} Previous
      </button>
      <button disabled={isLast} onClick={onNext}>
        Next {String.fromCharCode(8250)}
      </button>
      <button disabled={isLast} onClick={onLast}>
        Last {String.fromCharCode(187)}
      </button>
      <button disabled={allSelected} onClick={onSelectAll}>
        Select All
      </button>
      <button disabled={noneSelected} onClick={deselectAll}>
        Deselect All
      </button>
    </>
  );

  return (
    <>
      {buttonGroup}
      <Listbox
        focusedIndex={focusedIndex}
        selectedIndex={selectedIndex}
        onChange={(option) => {
          setFocusedIndex(option.index);
          setSelectedIndex(option.index);
        }}
      >
        {CAR_COMPANIES.map((car, i) => {
          const { name, value } = car;
          const isFocused = i === focusedIndex;
          const isSelected = Array.isArray(selectedIndex)
            ? selectedIndex.includes(i)
            : i === selectedIndex;
          const style = { background: isFocused ? "#96CCFF" : "" };

          return (
            <ListboxOption key={value} value={value} style={style}>
              {name} {isSelected && String.fromCharCode(10003)}
            </ListboxOption>
          );
        })}
      </Listbox>
    </>
  );
};
