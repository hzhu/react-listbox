import React, { useRef, useEffect, forwardRef, HTMLAttributes } from "react";
import PropTypes from "prop-types";
import { ListboxContext } from "./useListboxContext";
import { useListbox } from "./useListbox";

export interface IListboxProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "onSelect"> {
  onChange?: (value: string) => void;
  onSelect?: (value: string) => void;
}

export const Listbox = forwardRef<HTMLDivElement, IListboxProps>(
  (props, ref) => {
    const { onChange, onSelect, children, ...restProps } = props;
    const { state, dispatch, options, onKeyDown, onClickOption } = useListbox({
      onChange,
      onSelect,
    });
    const currentIndexRef = useRef(0);

    useEffect(() => {
      currentIndexRef.current = 0;
    });

    const value = {
      state,
      dispatch,
      options,
      onChange,
      onSelect,
      onClickOption,
      currentIndexRef,
    };

    return (
      <ListboxContext.Provider value={value}>
        <div
          role="listbox"
          ref={ref}
          tabIndex={0}
          onKeyDown={onKeyDown}
          {...restProps}
        >
          {children}
        </div>
      </ListboxContext.Provider>
    );
  }
);

Listbox.propTypes = {
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
};
