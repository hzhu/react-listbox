import React, { useRef, forwardRef, HTMLAttributes } from "react";
import PropTypes from "prop-types";
import { useListboxContext } from "../Listbox/useListboxContext";

export interface IListboxOptionProps extends HTMLAttributes<HTMLLIElement> {
  value: string;
}

export const ListboxOption = forwardRef<HTMLLIElement, IListboxOptionProps>(
  (props, ref) => {
    const { currentIndexRef, getOptionProps } = useListboxContext();
    const index = useRef(currentIndexRef.current++).current;

    return <li {...getOptionProps({ index, ref, ...props })} />;
  }
);

ListboxOption.propTypes = {
  value: PropTypes.string.isRequired,
};
