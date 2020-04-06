import { useContext, createContext, MutableRefObject } from "react";
import { IListboxState, ListboxActionTypes, IItem } from "./useListboxState";

export interface IListboxContext {
  onSelect?: (value: string) => void;
  currentIndexRef: MutableRefObject<number>;
  state: IListboxState;
  dispatch: React.Dispatch<ListboxActionTypes>;
  options: MutableRefObject<IItem[]>;
}

export const ListboxContext = createContext<IListboxContext | undefined>(
  undefined
);

export const useListboxContext = () => {
  const context = useContext(ListboxContext);

  if (context === undefined) {
    throw new Error("I has a sad");
  }

  return context;
};
