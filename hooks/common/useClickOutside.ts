import { useEffect, useRef } from "react";

export function useClickOutside<T extends HTMLElement>(
  callback: () => void,
  isActive: boolean = true,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!isActive) return;

    const handleClick = (event: MouseEvent) => {
      // 클릭된 요소가 ref 내부에 있는지 확인
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // 마우스 클릭 이벤트 리스너 추가
    document.addEventListener("mousedown", handleClick);

    // cleanup 함수에서 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [callback, isActive]);

  return ref;
}
