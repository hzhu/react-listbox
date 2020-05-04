import { useContext, HTMLProps, createContext } from "react";
import { IGetOptionProps } from "./useListbox";

export type GetOptionProps = (
  props: IGetOptionProps
) => HTMLProps<HTMLLIElement>;

export const ListboxContext = createContext<GetOptionProps | undefined>(
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
