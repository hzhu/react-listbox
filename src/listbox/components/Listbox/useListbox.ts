import {
  useRef,
  useEffect,
  useReducer,
  Dispatch,
  FocusEvent,
  KeyboardEvent,
  MutableRefObject,
  HTMLProps,
} from "react";
import { useId } from "@reach/auto-id";
import { composeEventHandlers, KEY_CODES } from "../../../utils";

export const FOCUS_OPTION = "focus option";
export const SELECT_OPTION = "select option";
export const MULTI_SELECT_OPTION = "multi select option";

export interface IOption {
  id: string;
  index: number;
  value: string;
}

export interface IFocusOption {
  type: typeof FOCUS_OPTION;
  payload: IOption;
}

export interface ISelectOption {
  type: typeof SELECT_OPTION;
  payload: IOption;
}

export interface IMultiSelectOption {
  type: typeof MULTI_SELECT_OPTION;
  payload: IOption;
}

export type ListboxActionTypes =
  | IFocusOption
  | ISelectOption
  | IMultiSelectOption;

export type SelectedValues = { [key: string]: boolean };

export interface IListboxState {
  focusedIndex: number;
  focusedValue: string;
  selectedId: string;
  selectedValue: string;
  selectedValues: SelectedValues;
}

export type ReducerType = (
  state: IListboxState,
  action: ListboxActionTypes
) => IListboxState;

export interface IGetOptionProps extends HTMLProps<HTMLLIElement> {
  index: number;
  value: string;
}

export interface IUseListboxReturnValue {
  getOptionProps: (props: IGetOptionProps) => HTMLProps<HTMLLIElement>;
  getListboxProps: (
    props: HTMLProps<HTMLUListElement>
  ) => HTMLProps<HTMLUListElement>;
}

export interface IUseListboxProps {
  onChange?: (value: string) => void;
  onSelect?: (value: string | SelectedValues) => void;
  multiselect?: boolean;
}

export interface IListenerProps extends IUseListboxProps {
  state: IListboxState;
  dispatch: Dispatch<ListboxActionTypes>;
  options: MutableRefObject<IOption[]>;
}

export type UseListboxType = (
  props: IUseListboxProps
) => IUseListboxReturnValue;

const reducer: ReducerType = (state, action) => {
  const { id, index, value } = action.payload;

  switch (action.type) {
    case FOCUS_OPTION:
      return {
        ...state,
        focusedIndex: index,
        focusedValue: value,
      };
    case SELECT_OPTION:
      return {
        ...state,
        selectedId: id,
        selectedValue: value,
        focusedIndex: index,
        focusedValue: value,
      };
    case MULTI_SELECT_OPTION:
      const { selectedValues } = state;
      return {
        ...state,
        selectedId: id,
        focusedIndex: index,
        focusedValue: value,
        selectedValues: {
          ...selectedValues,
          [value]: !selectedValues[value],
        },
      };
    default:
      return state;
  }
};

const initialState = {
  focusedIndex: -1,
  selectedId: "",
  focusedValue: "",
  selectedValue: "",
  selectedValues: {},
};

const handleClick = (
  { dispatch, options, multiselect }: IListenerProps,
  index: number
) => (e: FocusEvent<HTMLUListElement>) => {
  const option = options.current[index];
  if (multiselect) {
    dispatch({ type: MULTI_SELECT_OPTION, payload: option });
  } else {
    dispatch({ type: SELECT_OPTION, payload: option });
  }
};

const handleFocus = ({
  state,
  dispatch,
  options,
  multiselect,
}: IListenerProps) => (e: FocusEvent<HTMLUListElement>) => {
  if (state.focusedValue === "") {
    const option = options.current[0];
    dispatch({ type: FOCUS_OPTION, payload: option });
    if (!multiselect) {
      dispatch({ type: SELECT_OPTION, payload: option });
    }
  }
};

const handleKeyDown = ({
  state,
  dispatch,
  options,
  multiselect,
}: IListenerProps) => (e: KeyboardEvent<HTMLUListElement>) => {
  const key = e.which || e.keyCode;
  const { focusedIndex } = state;

  switch (key) {
    case KEY_CODES.UP:
      if (focusedIndex > 0) {
        const nextIndex = focusedIndex - 1;
        const option = options.current[nextIndex];
        if (multiselect) {
          dispatch({ type: FOCUS_OPTION, payload: option });
        } else {
          dispatch({ type: FOCUS_OPTION, payload: option });
          dispatch({ type: SELECT_OPTION, payload: option });
        }
      }
      break;
    case KEY_CODES.DOWN:
      if (focusedIndex !== options.current.length - 1) {
        const nextIndex = focusedIndex + 1;
        const option = options.current[nextIndex];
        if (multiselect) {
          dispatch({ type: FOCUS_OPTION, payload: option });
        } else {
          dispatch({ type: FOCUS_OPTION, payload: option });
          dispatch({ type: SELECT_OPTION, payload: option });
        }
      }
      break;
    case KEY_CODES.RETURN:
      const option = options.current[focusedIndex];
      if (multiselect) {
        dispatch({ type: MULTI_SELECT_OPTION, payload: option });
      } else {
        dispatch({ type: SELECT_OPTION, payload: option });
      }
      break;
  }
};

export const useListbox: UseListboxType = ({
  onChange,
  onSelect,
  multiselect,
}) => {
  const options = useRef<IOption[]>([]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const listenerProps = {
    state,
    dispatch,
    options,
    onChange,
    onSelect,
    multiselect,
  };
  const { focusedValue, selectedValue, selectedValues, selectedId } = state;

  useEffect(() => {
    if (multiselect) {
      onSelect && onSelect(selectedValues);
    } else {
      selectedValue && onSelect && onSelect(selectedValue);
    }
  }, [selectedValues, selectedValue]);

  useEffect(() => {
    onChange && onChange(focusedValue);
  }, [focusedValue]);

  const getOptionProps = ({
    ref,
    index,
    value,
    onClick,
    ...restProps
  }: IGetOptionProps): HTMLProps<HTMLLIElement> => {
    const stableId = useId();
    const id = `option--${value}--${stableId}`;

    useEffect(() => {
      const option = { id, index, value };
      options.current[index] = option;
    }, [id, index, value]);

    const ariaSelected = multiselect
      ? selectedValues[value]
      : id === selectedId;

    return {
      id,
      ref,
      role: "option",
      "aria-selected": ariaSelected,
      onClick: composeEventHandlers(onClick, handleClick(listenerProps, index)),
      ...restProps,
    };
  };

  const getListboxProps = ({
    ref,
    onFocus,
    onKeyDown,
    ...restProps
  }: HTMLProps<HTMLUListElement>) => ({
    ref,
    tabIndex: 0,
    role: "listbox",
    "aria-activedescendant": state.selectedId || undefined,
    onFocus: composeEventHandlers(onFocus, handleFocus(listenerProps)),
    onKeyDown: composeEventHandlers(onKeyDown, handleKeyDown(listenerProps)),
    ...restProps,
  });

  return {
    getOptionProps,
    getListboxProps,
  };
};
