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
import { KEY_CODES, composeEventHandlers } from "../../../utils";

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

export type SelectedValues = { [key: string]: IOption };

export interface IControlledListboxState {
  focusedIndex?: number;
  selectedIndex?: number | number[];
}

export interface IListboxState {
  focusedId: string;
  focusedIndex: number;
  focusedValue: string;
  selectedId: string;
  selectedIndex: number;
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
  onChange?: (option: IOption) => void;
  onSelect?: (value: IOption | SelectedValues) => void;
  multiSelect?: boolean;
  focusedIndex?: number;
  selectedIndex?: number | number[];
}

export interface IControlledHandlerArgs extends IUseListboxProps {
  state: IControlledListboxState;
  options: MutableRefObject<IOption[]>;
}

export interface IHandlerArg extends IUseListboxProps {
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
        focusedId: id,
        focusedIndex: index,
        focusedValue: value,
      };
    case SELECT_OPTION:
      return {
        ...state,
        selectedId: id,
        selectedIndex: index,
        selectedValue: value,
      };
    case MULTI_SELECT_OPTION:
      const { selectedValues } = state;
      const option = { id, index, value };
      let nextSelectedValues = {
        ...selectedValues,
        [value]: option,
      };

      if (selectedValues[value]) {
        const { [value]: _, ...restSelectedValues } = nextSelectedValues;
        nextSelectedValues = restSelectedValues;
      }

      return {
        ...state,
        selectedId: id,
        selectedIndex: index,
        selectedValues: nextSelectedValues,
      };
    default:
      return state;
  }
};

const initialState = {
  focusedId: "",
  focusedIndex: -1,
  focusedValue: "",
  selectedId: "",
  selectedIndex: -1,
  selectedValue: "",
  selectedValues: {},
};

const handleClick = (
  { dispatch, options, multiSelect }: IHandlerArg,
  index: number
) => (e: FocusEvent<HTMLUListElement>) => {
  const option = options.current[index];
  dispatch({ type: FOCUS_OPTION, payload: option });
  if (multiSelect) {
    dispatch({ type: MULTI_SELECT_OPTION, payload: option });
  } else {
    dispatch({ type: SELECT_OPTION, payload: option });
  }
};

const handleClickControlled = (
  { options, onChange, onSelect }: IControlledHandlerArgs,
  index: number
) => (e: FocusEvent<HTMLUListElement>) => {
  const option = options.current[index];
  onChange && onChange(option);
  onSelect && onSelect(option);
};

const handleFocus = ({
  state,
  dispatch,
  options,
  multiSelect,
}: IHandlerArg) => (e: FocusEvent<HTMLUListElement>) => {
  if (state.focusedValue === "") {
    const option = options.current[0];
    dispatch({ type: FOCUS_OPTION, payload: option });
    if (!multiSelect) {
      dispatch({ type: SELECT_OPTION, payload: option });
    }
  }
};

const handleKeyDownControlled = ({
  state,
  options,
  onChange,
  onSelect,
}: IControlledHandlerArgs) => (e: KeyboardEvent<HTMLUListElement>) => {
  const key = e.which || e.keyCode;
  const { focusedIndex } = state;

  if (focusedIndex === undefined) return;

  switch (key) {
    case KEY_CODES.UP:
      if (focusedIndex > 0) {
        const nextIndex = focusedIndex - 1;
        const option = options.current[nextIndex];
        onChange && onChange(option);
      }
      break;
    case KEY_CODES.DOWN:
      if (focusedIndex !== options.current.length - 1) {
        const nextIndex = focusedIndex + 1;
        const option = options.current[nextIndex];
        onChange && onChange(option);
      }
      break;
    case KEY_CODES.RETURN:
      const option = options.current[focusedIndex];
      onSelect && onSelect(option);
      break;
  }
};

const handleKeyDown = ({
  state,
  dispatch,
  options,
  multiSelect,
}: IHandlerArg) => (e: KeyboardEvent<HTMLUListElement>) => {
  const key = e.which || e.keyCode;
  const { focusedIndex } = state;

  switch (key) {
    case KEY_CODES.UP:
      if (focusedIndex > 0) {
        const nextIndex = focusedIndex - 1;
        const option = options.current[nextIndex];
        if (multiSelect) {
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
        if (multiSelect) {
          dispatch({ type: FOCUS_OPTION, payload: option });
        } else {
          dispatch({ type: FOCUS_OPTION, payload: option });
          dispatch({ type: SELECT_OPTION, payload: option });
        }
      }
      break;
    case KEY_CODES.RETURN:
      const option = options.current[focusedIndex];
      dispatch({ type: FOCUS_OPTION, payload: option });
      if (multiSelect) {
        dispatch({ type: MULTI_SELECT_OPTION, payload: option });
      }
      break;
  }
};

export const useListbox: UseListboxType = ({
  onChange,
  onSelect,
  multiSelect,
  focusedIndex: controlledFocusedIndex,
  selectedIndex: controlledSelectedIndex,
}) => {
  const isControlled =
    controlledSelectedIndex != null || controlledFocusedIndex != null;
  const options = useRef<IOption[]>([]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const handlerArgs = {
    state,
    dispatch,
    options,
    onChange,
    onSelect,
    multiSelect,
  };
  const controlledHandlerArgs = {
    state: {
      focusedIndex: controlledFocusedIndex,
      selectedIndex: controlledSelectedIndex,
    },
    options,
    onChange,
    onSelect,
  };

  const {
    focusedIndex,
    selectedId,
    selectedIndex,
    selectedValue,
    selectedValues,
  } = state;

  useEffect(() => {
    if (isControlled === false) {
      if (multiSelect) {
        onSelect && onSelect(selectedValues);
      } else {
        const option = options.current[selectedIndex];
        option && onSelect && onSelect(option);
      }
    }
  }, [
    onSelect,
    multiSelect,
    selectedIndex,
    selectedValues,
    selectedValue,
    isControlled,
  ]);

  useEffect(() => {
    if (isControlled === false) {
      const option = options.current[focusedIndex];
      option && onChange && onChange(option);
    }
  }, [onChange, focusedIndex, isControlled]);

  const getOptionProps = ({
    id,
    ref,
    index,
    value,
    onClick,
    ...restProps
  }: IGetOptionProps): HTMLProps<HTMLLIElement> => {
    if (id && !options.current[index]) {
      const option = { id, index, value };
      options.current[index] = option;
    }

    const ariaSelected = multiSelect
      ? id === (selectedValues[value] && selectedValues[value].id)
      : id === selectedId;

    return {
      id,
      ref,
      role: "option",
      "aria-selected": ariaSelected,
      onClick: composeEventHandlers(
        onClick,
        isControlled
          ? handleClickControlled(controlledHandlerArgs, index)
          : handleClick(handlerArgs, index)
      ),
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
    "aria-activedescendant": state.focusedId || undefined,
    onFocus: composeEventHandlers(onFocus, handleFocus(handlerArgs)),
    onKeyDown: composeEventHandlers(
      onKeyDown,
      isControlled
        ? handleKeyDownControlled(controlledHandlerArgs)
        : handleKeyDown(handlerArgs)
    ),
    ...restProps,
  });

  return {
    getOptionProps,
    getListboxProps,
  };
};
