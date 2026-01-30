"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ModalDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  placeholder?: string;
  label?: string;
  className?: string;
  dropdownClassName?: string;
}

export default function ModalDropdown({
  value,
  onChange,
  options = ["Y", "N"],
  placeholder = "선택해주세요",
  label,
  className,
  dropdownClassName,
}: ModalDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="flex w-full flex-col items-start">
      {label && (
        <div className="flex h-11 w-40 items-start gap-1 px-0 py-4">
          <div className="font-pretendard text-sm font-medium leading-4 text-gray-3">
            {label}
          </div>
        </div>
      )}
      <div className="relative w-full" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex h-12 w-full items-center justify-between rounded border border-red-3 bg-orange-4 px-5 py-4",
            className,
          )}
        >
          <div className="flex flex-1 items-center justify-between">
            <span className="font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-orange-3">
              {value || placeholder}
            </span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            >
              <path
                d="M11.1719 17.0336C11.5685 17.6198 12.4318 17.6198 12.8284 17.0336L19.9905 6.44734C20.4398 5.78326 19.964 4.88699 19.1622 4.88699H4.83802C4.03624 4.88699 3.56048 5.78326 4.00976 6.44734L11.1719 17.0336Z"
                fill="#911A00"
              />
            </svg>
          </div>
        </button>

        {/* 드롭다운 메뉴 */}
        {isOpen && (
          <div
            className={cn(
              "absolute top-full z-10 mt-1 w-full rounded border border-red-3 bg-white shadow-lg",
              dropdownClassName,
            )}
          >
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full px-5 py-3 text-left font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-orange-3 hover:bg-orange-4"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
