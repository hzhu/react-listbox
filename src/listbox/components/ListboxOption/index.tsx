import React, { useRef, useEffect, forwardRef, HTMLAttributes } from "react";
import PropTypes from "prop-types";
import { useId } from "@reach/auto-id";
import { useListboxContext } from "../Listbox/useListboxContext";

export interface IListboxOptionProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const ListboxOption = forwardRef<HTMLDivElement, IListboxOptionProps>(
  (props, ref) => {
    const stableId = useId();
    const id = `listbox--${stableId}`;
    const { value, children, ...restProps } = props;
    const {
      state,
      dispatch,
      onSelect,
      currentIndexRef,
      options,
    } = useListboxContext();
    const index = useRef(currentIndexRef.current++).current;
    const { selectedValue } = state;
    const isSelected = selectedValue === value;
    const item = { id, index, value };

    useEffect(() => {
      options.current.push(item);
    }, []);

    return (
      <div
        id={id}
        ref={ref}
        data-index={index}
        onClick={() => {
          dispatch({ type: "select item", payload: item });
          onSelect && onSelect(value);
        }}
        {...restProps}
      >
        {children} {isSelected && "[selected]"}
      </div>
    );
  }
);

ListboxOption.propTypes = {
  value: PropTypes.string.isRequired,
};
