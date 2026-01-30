"use client";

import React from "react";

interface CheckboxUIProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const CheckboxUI: React.FC<CheckboxUIProps> = ({
  id,
  checked,
  onChange,
  label,
  className = "",
  disabled = false,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === " " || e.key === "Enter") && !disabled) {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        role="checkbox"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        className={`relative flex h-[17px] w-[17px] cursor-pointer items-center justify-center rounded-sm border ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${checked ? "border-[#911A00] bg-[#EBE1DF]" : "border-[#911A00] bg-[#EBE1DF]"} `}
        style={{ borderWidth: "1px" }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {checked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            className="absolute"
          >
            <path
              d="M7.42031 11.8391L13.8163 5.44306L13.1093 4.73505L7.42031 10.4231L4.57031 7.57305L3.86231 8.28105L7.42031 11.8391ZM2.43631 16.3311C1.97565 16.3311 1.59131 16.1771 1.28331 15.8691C0.975312 15.5611 0.820979 15.1764 0.820312 14.7151V1.94705C0.820312 1.48639 0.974646 1.10205 1.28331 0.794055C1.59198 0.486055 1.97631 0.331721 2.43631 0.331055H15.2053C15.6653 0.331055 16.0496 0.485388 16.3583 0.794055C16.667 1.10272 16.821 1.48705 16.8203 1.94705V14.7161C16.8203 15.1761 16.6663 15.5604 16.3583 15.8691C16.0503 16.1777 15.6656 16.3317 15.2043 16.3311H2.43631Z"
              fill="#911A00"
            />
          </svg>
        )}

        {/* 접근성을 위한 숨겨진 input */}
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
          disabled={disabled}
        />
      </div>

      {label && (
        <label
          htmlFor={id}
          className={`text-[14px] text-neutral-500 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          onClick={!disabled ? handleClick : undefined}
        >
          {label}
        </label>
      )}
    </div>
  );
};
