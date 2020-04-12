import { useContext, createContext, Dispatch, MutableRefObject } from "react";
import { IListboxState, ListboxActionTypes, IOption } from "./useListbox";

export interface IListboxContext {
  state: IListboxState;
  dispatch: Dispatch<ListboxActionTypes>;
  options: MutableRefObject<IOption[]>;
  currentIndexRef: MutableRefObject<number>;
  onClickOption: (option: IOption) => void;
  onChange?: (value: string) => void;
  onSelect?: (value: string) => void;
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
