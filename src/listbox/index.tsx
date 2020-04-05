import React, {
	forwardRef,
	createContext,
	useRef,
	HTMLAttributes,
	createRef,
	useContext,
} from "react";

export const Listbox: React.FC = (props) => {
	return <div>{props.children}</div>;
};

export const ListboxOption: React.FC = (props) => {
	return <span>{props.children}</span>;
};
