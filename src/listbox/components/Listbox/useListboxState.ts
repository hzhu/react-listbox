import { useReducer } from "react";

export const SELECT_ITEM = "select item";

export interface IItem {
  id: string;
  index: number;
  value: string;
}

export interface ISelectItem {
  type: typeof SELECT_ITEM;
  payload: IItem;
}

export interface IListboxState {
  activeId: string;
  activeIndex: number;
  selectedValue: string;
}

export type ListboxActionTypes = ISelectItem;

export type ReducerType = (
  state: IListboxState,
  action: ListboxActionTypes
) => IListboxState;

const reducer: ReducerType = (state, action) => {
  switch (action.type) {
    case SELECT_ITEM:
      const { id, index, value } = action.payload;
      return {
        activeId: id,
        activeIndex: index,
        selectedValue: value,
      };
    default:
      return state;
  }
};

const initialState: IListboxState = {
  selectedValue: "",
  activeIndex: 0,
  activeId: "",
};

export const useListboxState = (): [
  IListboxState,
  React.Dispatch<ISelectItem>
] => {
  return useReducer(reducer, initialState);
};
