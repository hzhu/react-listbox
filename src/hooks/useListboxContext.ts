import { useContext, HTMLProps, createContext, MutableRefObject } from "react";
import { IGetOptionProps } from "./useListbox";

export interface IListboxContext {
  currentIndexRef: MutableRefObject<number>;
  getOptionProps: (props: IGetOptionProps) => HTMLProps<HTMLLIElement>;
}

export const ListboxContext = createContext<IListboxContext | undefined>(
  undefined
);

export const LISTBOX_CONTEXT_ERROR =
  "useListboxContext must be used within a ListboxProvider";

export const useListboxContext = () => {
  const context = useContext(ListboxContext);

  if (context === undefined) {
    throw new Error(LISTBOX_CONTEXT_ERROR);
  }

  return context;
};
