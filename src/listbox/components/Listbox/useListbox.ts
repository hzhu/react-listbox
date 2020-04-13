import {
  useRef,
  useEffect,
  useReducer,
  Dispatch,
  FocusEvent,
  MouseEvent,
  KeyboardEvent,
  MutableRefObject,
  HTMLProps,
} from "react";
import { useId } from "@reach/auto-id";
import { KEY_CODES } from "../../../utils";

export const FOCUS_OPTION = "focus option";
export const SELECT_OPTION = "select option";

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

export type ListboxActionTypes = IFocusOption | ISelectOption;

export interface IListboxState {
  focusedId: string;
  focusedIndex: number;
  focusedValue: string;
  selectedId: string;
  selectedValue: string;
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
  onSelect?: (value: string) => void;
}

export interface IListenerProps extends IUseListboxProps {
  state: IListboxState;
  dispatch: Dispatch<ListboxActionTypes>;
  options: MutableRefObject<IOption[]>;
}

export type useListboxType = (
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
        selectedValue: value,
        focusedIndex: index,
        focusedValue: value,
      };
    default:
      return state;
  }
};

const initialState = {
  focusedId: "",
  focusedIndex: 0,
  selectedId: "",
  focusedValue: "",
  selectedValue: "",
};

const handleFocus = ({
  state,
  dispatch,
  options,
  onChange,
}: IListenerProps) => (e: FocusEvent<HTMLUListElement>) => {
  if (state.focusedId === "") {
    const option = options.current[0];
    dispatch({ type: FOCUS_OPTION, payload: option });
    onChange && onChange(option.value);
  }
};

const handleKeyDown = ({
  state,
  dispatch,
  options,
  onChange,
  onSelect,
}: IListenerProps) => (e: KeyboardEvent<HTMLUListElement>) => {
  const key = e.which || e.keyCode;
  const { focusedId, focusedIndex, focusedValue } = state;

  switch (key) {
    case KEY_CODES.UP:
      if (focusedIndex > 0) {
        const nextIndex = focusedIndex - 1;
        const option = options.current[nextIndex];
        dispatch({ type: FOCUS_OPTION, payload: option });
        onChange && onChange(option.value);
      }
      break;
    case KEY_CODES.DOWN:
      if (focusedIndex !== options.current.length - 1) {
        const nextIndex = focusedIndex + 1;
        const option = options.current[nextIndex];
        dispatch({ type: FOCUS_OPTION, payload: option });
        onChange && onChange(option.value);
      }
      break;
    case KEY_CODES.RETURN:
      const option = {
        id: focusedId,
        index: focusedIndex,
        value: focusedValue,
      };
      dispatch({ type: SELECT_OPTION, payload: option });
      onSelect && onSelect(option.value);
      break;
  }
};

export const useListbox: useListboxType = ({ onChange, onSelect }) => {
  const options = useRef<IOption[]>([]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const listboxListenerProps = {
    state,
    dispatch,
    options,
    onChange,
    onSelect,
  };

  const onFocus = handleFocus(listboxListenerProps);
  const onKeyDown = handleKeyDown(listboxListenerProps);

  const focusAndSelectOption = (index: number) => {
    const option = options.current[index];
    onChange && onChange(option.value);
    onSelect && onSelect(option.value);
    dispatch({ type: SELECT_OPTION, payload: option });
  };

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

    return {
      id,
      ref,
      role: "option",
      "aria-selected": id === state.selectedId || undefined,
      onClick: (event: MouseEvent<HTMLLIElement>) => {
        onClick && onClick(event);
        focusAndSelectOption(index);
      },
      ...restProps,
    };
  };

  const getListboxProps = ({
    ref,
    ...restProps
  }: HTMLProps<HTMLUListElement>) => ({
    ref,
    onFocus,
    onKeyDown,
    tabIndex: 0,
    role: "listbox",
    "aria-activedescendant": state.selectedId || undefined,
    ...restProps,
  });

  return {
    getOptionProps,
    getListboxProps,
  };
};
