import React, { useRef, useEffect, forwardRef, HTMLAttributes } from "react";
import PropTypes from "prop-types";
import { ListboxContext } from "./useListboxContext";
import { useListbox, IUseListboxProps } from "./useListbox";

export interface IListboxProps
  extends Omit<HTMLAttributes<HTMLUListElement>, "onChange" | "onSelect">,
    IUseListboxProps {}

// TODO: Not sure why addon-docs doesn't show PrimarySlot description, so it temporarily lives here.
// Maybe remove this when https://github.com/storybookjs/storybook/pull/10180 is merged.
/**
An [uncontrolled](https://gist.github.com/ryanflorence/e2fa045ad523f2228d34ce3f94df75b3) component is driven by _state_, while a
controlled component is driven by _props_. This listbox component's behavior is driven by internal state, and demonstrates uncontrolled
single-select behavior. The component accepts a `multiSelect` prop which toggles on multi-select behavior.
**/
export const Listbox = forwardRef<HTMLUListElement, IListboxProps>(
  (props, ref) => {
    const {
      onChange,
      onSelect,
      multiSelect,
      focusedIndex,
      selectedIndex,
      children,
      ...restProps
    } = props;

    const { getOptionProps, getListboxProps } = useListbox({
      multiSelect,
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

Listbox.defaultProps = {
  multiSelect: false,
};

Listbox.propTypes = {
  /** A function that is called with the focused option when focused state changes. */
  onChange: PropTypes.func,
  /** A function that is called with the selected option when selected state changes. */
  onSelect: PropTypes.func,
  /** Turns on multi-select listbox behavior. Only useful for [uncontrolled](https://gist.github.com/ryanflorence/e2fa045ad523f2228d34ce3f94df75b3) listbox usages.*/
  multiSelect: PropTypes.bool,
  /** An index of the foucsed option. Only useful for [controlled](https://gist.github.com/ryanflorence/e2fa045ad523f2228d34ce3f94df75b3) listbox usages.*/
  focusedIndex: PropTypes.number,
  /** An index or array of indices of the selected value(s). Only useful for [controlled](https://gist.github.com/ryanflorence/e2fa045ad523f2228d34ce3f94df75b3) listbox usages.*/
  selectedIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
};

Listbox.displayName = "Listbox";
