import { useRef, useEffect, RefObject, MutableRefObject } from "react";

export type Ref<T> =
  | null
  | undefined
  | RefObject<T>
  | MutableRefObject<T>
  | ((instance: T | null) => void);

export function useMergeRefs<T>(...refs: Ref<T>[]) {
  const mergedRef = useRef<T>(null);

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        ref(mergedRef.current);
      } else {
        (ref as any).current = mergedRef.current;
      }
    });
  }, [refs]);

  return mergedRef;
}
