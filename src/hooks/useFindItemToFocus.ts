import { useRef, RefObject } from "react";

export const useFindItemToFocus = (
  listboxRef: RefObject<HTMLUListElement>,
  onFound: (index: number) => void,
  delay = 500
) => {
  const cacheTypedChars = useRef("");
  const timeoutId = useRef<number>();

  return (e: KeyboardEvent) => {
    const optionNodes =
      listboxRef.current &&
      listboxRef.current.querySelectorAll('[role="option"]');
    const key = e.which || e.keyCode;
    const character = String.fromCharCode(key);

    cacheTypedChars.current += character.toLowerCase();

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = window.setTimeout(
      () => (cacheTypedChars.current = ""),
      delay
    );

    if (cacheTypedChars.current && optionNodes !== null) {
      for (let index = 0; index < optionNodes.length; index++) {
        if (optionNodes === null || optionNodes[index] === undefined) {
          continue;
        }
        const optionText = optionNodes[index].textContent?.toLowerCase();
        const textFound = optionText?.startsWith(cacheTypedChars.current);
        if (textFound) {
          onFound(index);
          break;
        }
      }
    }
  };
};
