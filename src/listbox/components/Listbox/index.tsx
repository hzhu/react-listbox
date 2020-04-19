import React, { useRef, useEffect, forwardRef, HTMLAttributes } from "react";
import PropTypes from "prop-types";
import { ListboxContext } from "./useListboxContext";
import { useListbox, IOption } from "./useListbox";

export interface IListboxProps
  extends Omit<HTMLAttributes<HTMLUListElement>, "onChange" | "onSelect"> {
  onChange?: (option: IOption) => void;
  onSelect?: (value: IOption | { [key: string]: IOption }) => void;
  multiselect?: boolean;
}

export const Listbox = forwardRef<HTMLUListElement, IListboxProps>(
  (props, ref) => {
    const { multiselect, onChange, onSelect, children, ...restProps } = props;
    const { getOptionProps, getListboxProps } = useListbox({
      multiselect,
      onChange,
      onSelect,
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
};
