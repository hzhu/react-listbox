import React, { useRef, useEffect, forwardRef, HTMLAttributes } from "react";
import PropTypes from "prop-types";
import { ListboxContext } from "./useListboxContext";
import { useListbox, IUseListboxProps } from "./useListbox";

export interface IListboxProps
  extends Omit<HTMLAttributes<HTMLUListElement>, "onChange" | "onSelect">,
    IUseListboxProps {}

export const Listbox = forwardRef<HTMLUListElement, IListboxProps>(
  (props, ref) => {
    const {
      onChange,
      onSelect,
      multiselect,
      focusedIndex,
      selectedIndex,
      children,
      ...restProps
    } = props;

    const { getOptionProps, getListboxProps } = useListbox({
      multiselect,
      onChange,
      onSelect,
      focusedIndex,
      selectedIndex,
    });
    const currentIndexRef = useRef(0);

    useEffect(() => {
      currentIndexRef.current = 0;
    });

    const value = { getOptionProps, currentIndexRef };

    return (
      <ListboxContext.Provider value={value}>
        <ul {...getListboxProps({ ref, ...restProps })}>{children}</ul>
      </ListboxContext.Provider>
    );
  }
);

Listbox.propTypes = {
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  multiselect: PropTypes.bool,
  focusedIndex: PropTypes.number,
  selectedIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
};
