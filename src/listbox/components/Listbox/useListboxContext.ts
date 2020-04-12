import { useContext, createContext, Dispatch, MutableRefObject } from "react";
import {
  IOption,
  IListboxState,
  ListboxActionTypes,
  IGetOptionProps,
} from "./useListbox";

export interface IListboxContext {
  state: IListboxState;
  dispatch: Dispatch<ListboxActionTypes>;
  options: MutableRefObject<IOption[]>;
  currentIndexRef: MutableRefObject<number>;
  onChange?: (value: string) => void;
  onSelect?: (value: string) => void;
  getOptionProps: (props: IGetOptionProps) => React.HTMLProps<HTMLLIElement>;
}

export const ListboxContext = createContext<IListboxContext | undefined>(
  undefined
);

export const useListboxContext = () => {
  const context = useContext(ListboxContext);

  if (context === undefined) {
    throw new Error("useListboxContext must be used within a ListboxProvider");
  }

  return context;
};
