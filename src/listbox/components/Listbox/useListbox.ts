import {
  useRef,
  useReducer,
  Dispatch,
  KeyboardEvent,
  MutableRefObject,
} from "react";
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
  activeId: string;
  activeIndex: number;
  focusedValue: string;
  selectedValue: string;
}

export type ReducerType = (
  state: IListboxState,
  action: ListboxActionTypes
) => IListboxState;

export interface IUseListboxReturnValue {
  state: IListboxState;
  dispatch: Dispatch<ListboxActionTypes>;
  options: MutableRefObject<IOption[]>;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
  onClickOption: (option: IOption) => void;
}

export interface IUseListboxProps {
  onChange?: (value: string) => void;
  onSelect?: (value: string) => void;
}

export type useListboxType = (
  props: IUseListboxProps
) => IUseListboxReturnValue;

export interface IUseKeyDownProps extends IUseListboxProps {
  state: IListboxState;
  dispatch: Dispatch<ListboxActionTypes>;
  options: MutableRefObject<IOption[]>;
}

const reducer: ReducerType = (state, action) => {
  const { id, index, value } = action.payload;

  switch (action.type) {
    case FOCUS_OPTION:
      return {
        ...state,
        activeId: id,
        activeIndex: index,
        focusedValue: value,
      };
    case SELECT_OPTION:
      return {
        ...state,
        activeIndex: index,
        focusedValue: value,
        selectedValue: value,
      };
    default:
      return state;
  }
};

const initialState = {
  activeId: "",
  activeIndex: 0,
  focusedValue: "",
  selectedValue: "",
};

export interface IUseClickOptionProps extends IUseListboxProps {
  dispatch: Dispatch<ListboxActionTypes>;
}

const useClickOption = ({
  dispatch,
  onChange,
  onSelect,
}: IUseClickOptionProps) => (option: IOption) => {
  dispatch({ type: FOCUS_OPTION, payload: option });
  dispatch({ type: SELECT_OPTION, payload: option });
  onChange && onChange(option.value);
  onSelect && onSelect(option.value);
};

const useKeyDown = ({
  state,
  dispatch,
  options,
  onChange,
  onSelect,
}: IUseKeyDownProps) => (e: KeyboardEvent<HTMLDivElement>) => {
  const key = e.which || e.keyCode;
  const { activeId, activeIndex, focusedValue } = state;

  switch (key) {
    case KEY_CODES.UP:
      if (activeIndex > 0) {
        const nextIndex = activeIndex - 1;
        const option = options.current[nextIndex];
        dispatch({ type: FOCUS_OPTION, payload: option });
        onChange && onChange(option.value);
      }
      break;
    case KEY_CODES.DOWN:
      if (activeIndex !== options.current.length - 1) {
        const nextIndex = activeIndex + 1;
        const option = options.current[nextIndex];
        dispatch({ type: FOCUS_OPTION, payload: option });
        onChange && onChange(option.value);
      }
      break;
    case KEY_CODES.RETURN:
      const option = {
        id: activeId,
        index: activeIndex,
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

  const onKeyDown = useKeyDown({
    state,
    dispatch,
    options,
    onChange,
    onSelect,
  });

  const onClickOption = useClickOption({ dispatch, onChange, onSelect });

  return {
    state,
    dispatch,
    options,
    onKeyDown,
    onClickOption,
  };
};
