import React, { useRef, useEffect, forwardRef, HTMLAttributes } from "react";
import PropTypes from "prop-types";
import { useId } from "@reach/auto-id";
import { useListboxContext } from "../Listbox/useListboxContext";

export interface IListboxOptionProps extends HTMLAttributes<HTMLLIElement> {
  value: string;
}

export const ListboxOption = forwardRef<HTMLLIElement, IListboxOptionProps>(
  (props, ref) => {
    const { value, children, ...restProps } = props;
    const stableId = useId();
    const id = `listbox--option--${value}--${stableId}`;
    const { options, currentIndexRef, onClickOption } = useListboxContext();
    const index = useRef(currentIndexRef.current++).current;
    const option = { id, index, value };

    useEffect(() => {
      options.current[index] = option;
    }, [id, index, value]);

    return (
      <li
        id={id}
        ref={ref}
        onClick={() => onClickOption && onClickOption(option)}
        {...restProps}
      >
        {children}
      </li>
    );
  }
);

ListboxOption.propTypes = {
  value: PropTypes.string.isRequired,
};
