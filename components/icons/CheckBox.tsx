import { cn } from "@/lib/utils";
import { IconProps } from "./types";

interface CheckBoxProps extends IconProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function CheckBox({
  className,
  checked,
  onChange,
}: CheckBoxProps) {
  return (
    <button
      type="button"
      className={cn("flex h-6 w-6 items-center justify-center", className)}
      onClick={() => onChange(!checked)}
    >
      {checked ? (
        <svg
          width="24"
          height="24"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.1 15.5432L17.496 9.14716L16.789 8.43916L11.1 14.1272L8.25 11.2772L7.542 11.9852L11.1 15.5432ZM6.116 20.0352C5.65533 20.0352 5.271 19.8812 4.963 19.5732C4.655 19.2652 4.50067 18.8805 4.5 18.4192V5.65116C4.5 5.19049 4.65433 4.80616 4.963 4.49816C5.27167 4.19016 5.656 4.03582 6.116 4.03516H18.885C19.345 4.03516 19.7293 4.18949 20.038 4.49816C20.3467 4.80682 20.5007 5.19116 20.5 5.65116V18.4202C20.5 18.8802 20.346 19.2645 20.038 19.5732C19.73 19.8818 19.3453 20.0358 18.884 20.0352H6.116Z"
            fill="#911A00"
          />
        </svg>
      ) : (
        <svg
          width="24"
          height="24"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.116 20.0352C5.65533 20.0352 5.271 19.8812 4.963 19.5732C4.655 19.2652 4.50067 18.8805 4.5 18.4192V5.65116C4.5 5.19049 4.65433 4.80616 4.963 4.49816C5.27167 4.19016 5.656 4.03582 6.116 4.03516H18.885C19.345 4.03516 19.7293 4.18949 20.038 4.49816C20.3467 4.80682 20.5007 5.19116 20.5 5.65116V18.4202C20.5 18.8802 20.346 19.2645 20.038 19.5732C19.73 19.8818 19.3453 20.0358 18.884 20.0352H6.116Z"
            stroke="#911A00"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      )}
    </button>
  );
}
