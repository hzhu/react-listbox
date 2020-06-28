import React, { useState, useCallback, CSSProperties } from "react";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import { Listbox } from "../../components/Listbox";
import { ListboxOption } from "../../components/ListboxOption";
import { ListboxGroup } from "../../components/ListboxGroup";
import { SelectedValues, IOption } from "../../hooks/useListbox";
import "./stories.css";

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
  const defaultValue = false;
  const scroll = boolean("scroll", defaultValue);
  const multiSelect = boolean("multiSelect", defaultValue);
  const [focusedOption, setFocusedOption] = useState<IOption | undefined>();
  const [selectedOption, setSelectedOption] = useState<
    IOption | SelectedValues
  >({});
  const onChange = useCallback((option) => setFocusedOption(option), []);
  const onSelect = useCallback((option) => setSelectedOption(option), []);
  const style: CSSProperties = {
    maxHeight: "10em",
    overflowY: "auto",
    position: "relative",
    border: "1px solid #ccc",
  };

  return (
    <Listbox
      onChange={onChange}
      onSelect={onSelect}
      multiSelect={multiSelect}
      style={scroll ? style : undefined}
    >
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

Uncontrolled.story = {
  parameters: {
    docs: {
      storyDescription: `An [uncontrolled](https://gist.github.com/ryanflorence/e2fa045ad523f2228d34ce3f94df75b3) component is driven by _state_, while a
      controlled component is driven by _props_. This listbox component's behavior is driven by internal state, and demonstrates uncontrolled single-select
      behavior. The component accepts a \`multiSelect\` prop which toggles on multi-select behavior.`,
    },
  },
};

export const Controlled = () => {
  const [focusedIndex, setFocusedIndex] = useState<number>(13);
  const [selectedIndex, setSelectedIndex] = useState<number | number[]>(13);
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

Controlled.story = {
  parameters: {
    docs: {
      storyDescription: `A [controlled](https://gist.github.com/ryanflorence/e2fa045ad523f2228d34ce3f94df75b3) component is driven by _props_, while an
      uncontrolled component is driven by _state_. This listbox component's behavior is driven by props, and demonstrates custom behavior such
      as "Select All" and "Deselect All".`,
    },
  },
};

export const StrictMode = () => {
  const [focusedOption, setFocusedOption] = useState<IOption | undefined>();
  const onChange = useCallback((option) => setFocusedOption(option), []);

  return (
    <React.StrictMode>
      <Listbox onChange={onChange}>
        {CAR_COMPANIES.map((car, index) => {
          const { name, value } = car;
          const isFocused = index === focusedOption?.index;
          const style = { background: isFocused ? "#96CCFF" : "" };

          return (
            <ListboxOption key={value} value={value} style={style}>
              {name} {isFocused && String.fromCharCode(10003)}
            </ListboxOption>
          );
        })}
      </Listbox>
    </React.StrictMode>
  );
};

StrictMode.story = {
  parameters: {
    docs: {
      storyDescription: `[StrictMode](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects) is a tool for highlighting potential 
      problems in an application. It is used here to demonstrate that the components will work in React's [Concurrent Mode](https://reactjs.org/docs/concurrent-mode-intro.html).`,
    },
  },
};

export const Grouped = () => {
  return (
    <Listbox>
      <ListboxGroup
        label={<span style={{ fontWeight: 700 }}>United States</span>}
      >
        <ListboxOption value="ford">Ford</ListboxOption>
        <ListboxOption value="gm">General Motors</ListboxOption>
        <ListboxOption value="tesla">Tesla</ListboxOption>
      </ListboxGroup>
      <ListboxGroup label={<span style={{ fontWeight: 700 }}>Japan</span>}>
        <ListboxOption value="toyota">Toyota</ListboxOption>
        <ListboxOption value="honda">Honda</ListboxOption>
        <ListboxOption value="suzuki">Suzuki</ListboxOption>
      </ListboxGroup>
    </Listbox>
  );
};

Grouped.story = {
  parameters: {
    docs: {
      storyDescription: `This story demonstrates a grouped listbox component using the \`<ListboxGroup>\` component.
      Each group renders a label which (visually) identifies the group of options to users. Internally, an ID associates
      the label and the group which allows screen readers to identify the group of options to users.`,
    },
  },
};

export default {
  title: "Listbox",
  decorators: [withKnobs],
  component: Listbox,
  subcomponents: { ListboxOption, ListboxGroup },
  parameters: {
    componentSubtitle:
      "A listbox widget presents a list of options and allows a user to select one or more of them.",
  },
};
