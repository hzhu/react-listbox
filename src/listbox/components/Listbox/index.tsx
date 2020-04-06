import React, { useRef, forwardRef, HTMLAttributes } from "react";
import PropTypes from "prop-types";
import { ListboxContext } from "./useListboxContext";
import { useListboxState, SELECT_ITEM } from "./useListboxState";
import { KEY_CODES } from "../../../utils";

export interface IListboxProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  onSelect?: (value: string) => void;
}

export const Listbox = forwardRef<HTMLDivElement, IListboxProps>(
  (props, ref) => {
    const { onSelect, children, ...restProps } = props;
    const [state, dispatch] = useListboxState();
    const options = useRef([]);

    const currentIndexRef = useRef(0);

    const value = {
      state,
      dispatch,
      onSelect,
      currentIndexRef,
      options,
    };

    const checkKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const key = e.which || e.keyCode;

      switch (key) {
        case KEY_CODES.UP:
          if (state.activeIndex > 0) {
            const nextIndex = state.activeIndex - 1;
            const payload = options.current[nextIndex];
            dispatch({ type: SELECT_ITEM, payload });
          }
          break;
        case KEY_CODES.DOWN:
          if (state.activeIndex !== options.current.length - 1) {
            const nextIndex = state.activeIndex + 1;
            const payload = options.current[nextIndex];
            dispatch({ type: SELECT_ITEM, payload });
          }
          break;
        default:
          throw new Error("sad");
      }
    };

    return (
      <ListboxContext.Provider value={value}>
        <div
          role="listbox"
          ref={ref}
          tabIndex={0}
          onKeyDown={checkKeyPress}
          {...restProps}
        >
          {children}
        </div>
      </ListboxContext.Provider>
    );
  }
);

// multiple: can select multiple options
Listbox.propTypes = {
  onSelect: PropTypes.func,
};
