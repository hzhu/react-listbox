import { useRef, RefObject, KeyboardEvent } from "react";

export const useFindItemToFocus = (
  listboxRef: RefObject<HTMLUListElement>,
  onFound: (index: number) => void,
  delay = 500
) => {
  const cacheTypedChars = useRef("");
  const timeoutId = useRef<number>();

  return (e: KeyboardEvent<HTMLUListElement>) => {
    const optionNodes =
      listboxRef.current &&
      listboxRef.current.querySelectorAll('[role="option"]');
    const character = e.key;

    if (character.length === 1) {
      cacheTypedChars.current += character.toLowerCase();
    }

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = window.setTimeout(
      () => (cacheTypedChars.current = ""),
      delay
    );
    if (cacheTypedChars.current && optionNodes !== null) {
      for (let index = 0; index < optionNodes.length; index++) {
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
