import React, { useRef, forwardRef, HTMLAttributes } from "react";
import PropTypes from "prop-types";
import { useId } from "@reach/auto-id";
import { useListboxContext } from "../hooks/useListboxContext";

export interface IListboxOptionProps extends HTMLAttributes<HTMLLIElement> {
  value: string;
}

export const ListboxOption = forwardRef<HTMLLIElement, IListboxOptionProps>(
  (props, ref) => {
    const { currentIndexRef, getOptionProps } = useListboxContext();
    const index = useRef(currentIndexRef.current++).current;
    const stableId = useId();

    return <li {...getOptionProps({ id: stableId, index, ref, ...props })} />;
  }
);

ListboxOption.propTypes = {
  /** A discrete value for the option. */
  value: PropTypes.string.isRequired,
};

ListboxOption.displayName = "ListboxOption";
