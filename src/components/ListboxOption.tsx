import React, { useRef, useEffect, forwardRef, HTMLAttributes } from "react";
import PropTypes from "prop-types";
import { useId } from "@reach/auto-id";
import { useListboxContext } from "../hooks/useListboxContext";

export interface IListboxOptionProps extends HTMLAttributes<HTMLLIElement> {
  value: string;
}

export const ListboxOption = forwardRef<HTMLLIElement, IListboxOptionProps>(
  (props, ref) => {
    const id = useId();
    const { value } = props;
    const prefixedId = `option--${value}--${id}`;
    const { options, getOptionProps, currentIndexRef } = useListboxContext();
    const index = useRef(currentIndexRef.current++);

    useEffect(() => {
      if (id) {
        const option = {
          value,
          id: prefixedId,
          index: index.current,
        };

        options.current[index.current] = option;
      }
    }, [id, value, options, prefixedId]);

    return (
      <li
        {...getOptionProps({
          ref,
          id: prefixedId,
          index: index.current,
          ...props,
        })}
      />
    );
  }
);

ListboxOption.propTypes = {
  /** A discrete value for the option. */
  value: PropTypes.string.isRequired,
};

ListboxOption.displayName = "ListboxOption";
