import React, {
  forwardRef,
  useEffect,
  useReducer,
  useContext,
  useCallback,
  createContext,
  HTMLAttributes,
  Dispatch,
} from "react";
import { useId } from "@reach/auto-id";
import { Listbox, IListboxPropsAttributes } from "../../components/Listbox";
import { IOption, SelectedValues } from "../../hooks/useListbox";
import {
  ListboxOption,
  IListboxOptionProps,
} from "../../components/ListboxOption";
import { KEY_CODES } from "../../utils";
import { useMergeRefs } from "../../hooks/useMergeRefs";

const initialState = {
  id: "",
  index: 0,
  value: "",
  expanded: false,
};

const EXPAND = "expand";
const COLLAPSE = "collapse";
const SELECT_INDEX = "select index";
const SELECT_OPTION = "select option";
const INITIAL_SELECT_OPTION = "initial render select";

interface IExpand {
  type: typeof EXPAND;
}

interface ICollapse {
  type: typeof COLLAPSE;
}

interface ISelectIndex {
  type: typeof SELECT_INDEX;
  payload: number;
}

interface ISelectOption {
  type: typeof SELECT_OPTION;
  payload: IOption | SelectedValues;
}

interface IInitialSelectOption {
  type: typeof INITIAL_SELECT_OPTION;
  payload: { value: string };
}

type SelectActionTypes =
  | ISelectOption
  | IExpand
  | ICollapse
  | IInitialSelectOption
  | ISelectIndex;

type ReducerType = (
  state: typeof initialState,
  action: SelectActionTypes
) => typeof initialState;

interface ISelectContext {
  id: string;
  value: string;
  index: number;
  labelId: string;
  buttonId: string;
  listboxId: string;
  expanded: boolean;
  dispatch: Dispatch<SelectActionTypes>;
  onChange: (option: IOption | SelectedValues) => void;
}

const SelectContext = createContext<ISelectContext | undefined>(undefined);

const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (context === undefined) {
    throw new Error(
      "useSelectContext must be used within a SelectContext.Provider"
    );
  }

  return context;
};

export const Label = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    const { labelId } = useSelectContext();

    return <div id={labelId} ref={ref} {...props} />;
  }
);

export const Button = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  const { value, expanded, dispatch, labelId, buttonId } = useSelectContext();
  const onClick = () => dispatch({ type: "expand" });

  return (
    <button
      ref={ref}
      id={buttonId}
      onClick={onClick}
      aria-haspopup="listbox"
      aria-expanded={expanded}
      aria-labelledby={`${labelId} ${buttonId}`}
      {...props}
    >
      {value || props.children}
    </button>
  );
});

export const List = forwardRef<HTMLUListElement, IListboxPropsAttributes>(
  (props, ref) => {
    const {
      index,
      labelId,
      buttonId,
      listboxId,
      expanded,
      dispatch,
      onChange,
    } = useSelectContext();

    const onSelect = useCallback(
      (option: IOption | SelectedValues) => {
        if (expanded) {
          dispatch({ type: "select option", payload: option });
          onChange(option);
        }
      },
      [expanded, dispatch, onChange]
    );

    const listboxRef = useMergeRefs<HTMLUListElement>(ref);

    useEffect(() => {
      if (expanded && listboxRef.current) {
        listboxRef.current.focus();
      }
    }, [expanded, listboxRef]);

    return (
      <Listbox
        id={listboxId}
        ref={listboxRef}
        onSelect={onSelect}
        onChange={onSelect}
        focusedIndex={index}
        selectedIndex={index}
        aria-labelledby={labelId}
        onBlur={() => dispatch({ type: "collapse" })}
        onKeyDown={(e) => {
          if (e.keyCode === KEY_CODES.RETURN || e.keyCode === KEY_CODES.ESC) {
            e.preventDefault();
            dispatch({ type: "collapse" });
            document.getElementById(buttonId)?.focus();
          }

          if (e.keyCode === KEY_CODES.UP) {
            e.preventDefault();
            if (index > 0) {
              dispatch({ type: "select index", payload: index - 1 });
            }
          }

          if (e.keyCode === KEY_CODES.DOWN) {
            if (listboxRef.current) {
              if (index < listboxRef.current?.children.length - 1) {
                e.preventDefault();
                dispatch({ type: "select index", payload: index + 1 });
              }
            }
          }
        }}
        {...props}
        style={{ display: expanded ? "block" : "none", ...props.style }}
      />
    );
  }
);

export const Option = forwardRef<HTMLLIElement, IListboxOptionProps>(
  (props, ref) => {
    const { dispatch, value } = useSelectContext();
    const mergedRef = useMergeRefs(ref);

    useEffect(() => {
      if (!value) {
        dispatch({
          type: "initial render select",
          payload: { value: props.value },
        });
      }
    }, [value, props.value, dispatch]);

    return <ListboxOption ref={mergedRef} {...props} />;
  }
);

const reducer: ReducerType = (state, action) => {
  switch (action.type) {
    case "expand":
      return {
        ...state,
        expanded: true,
      };
    case "collapse":
      return {
        ...state,
        expanded: false,
      };
    case "initial render select":
      if (state.value !== "") {
        return state;
      }
      return {
        ...state,
        ...action.payload,
      };
    case "select option":
      return {
        ...state,
        ...action.payload,
      };
    case "select index":
      return {
        ...state,
        index: action.payload,
      };
    default:
      return state;
  }
};

export interface ISelectProps {
  onChange: (option: IOption | SelectedValues) => void;
}

export const Select: React.FC<ISelectProps> = ({ onChange, children }) => {
  const id = useId();
  const labelId = `select-label-${id}`;
  const buttonId = `select-button-${id}`;
  const listboxId = `select-listbox-${id}`;
  const [state, dispatch] = useReducer(reducer, initialState);

  const context = {
    ...state,
    labelId,
    buttonId,
    listboxId,
    onChange,
    dispatch,
  };

  return (
    <SelectContext.Provider value={context}>{children}</SelectContext.Provider>
  );
};
