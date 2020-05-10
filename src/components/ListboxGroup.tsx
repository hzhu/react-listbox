import React, {
  forwardRef,
  cloneElement,
  ReactNode,
  ReactElement,
  HTMLAttributes,
} from "react";
import PropTypes from "prop-types";
import { useId } from "@reach/auto-id";

export interface IListboxGroupProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
}

export const ListboxGroup = forwardRef<HTMLDivElement, IListboxGroupProps>(
  (props, ref) => {
    const stableId = useId();
    const id = `listbox-group-${stableId}`;
    const label = cloneElement(props.label as ReactElement, { id });

    return (
      <div ref={ref} role="group" aria-labelledby={id}>
        {label}
        {props.children}
      </div>
    );
  }
);

ListboxGroup.propTypes = {
  /** Label that describes a group of options. */
  label: PropTypes.node.isRequired,
};

ListboxGroup.displayName = "ListboxGroup";
