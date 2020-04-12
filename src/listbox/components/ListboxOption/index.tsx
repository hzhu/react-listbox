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
    const { options, currentIndexRef, onClickOption } = useListboxContext();
    const index = useRef(currentIndexRef.current++).current;
    const option = { id, index, value };

    useEffect(() => {
      options.current[index] = option;
    }, [id, index, value]);

    return (
      <div
        id={id}
        ref={ref}
        data-index={index}
        onClick={() => onClickOption && onClickOption(option)}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

ListboxOption.propTypes = {
  value: PropTypes.string.isRequired,
};
