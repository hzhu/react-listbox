import { useContext, createContext, MutableRefObject } from "react";
import { IGetOptionProps } from "./useListbox";

export interface IListboxContext {
  currentIndexRef: MutableRefObject<number>;
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
