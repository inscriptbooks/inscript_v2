/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import ChevronDown from "@/components/icons/ChevronDown";

interface DateEditProps {
  value?: Date;
  onChange?: (date: Date) => void;
  onConfirm?: (date: Date) => void;
  onCancel?: () => void;
  className?: string;
}

const DAYS_OF_WEEK = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];

export default function DateEdit({
  value,
  onChange,
  onConfirm,
  onCancel,
  className,
}: DateEditProps) {
  const [currentDate, setCurrentDate] = useState(value || new Date());
  const [selectedDate, setSelectedDate] = useState(value || new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 해당 월의 첫 번째 날과 마지막 날
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // 첫 번째 날의 요일 (0: 일요일)
  const firstDayWeekday = firstDayOfMonth.getDay();

  // 해당 월의 일수
  const daysInMonth = lastDayOfMonth.getDate();

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // 날짜 선택
  const selectDate = (day: number) => {
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);
    onChange?.(newDate);
  };

  // 오늘 날짜인지 확인
  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  // 선택된 날짜인지 확인
  const isSelected = (day: number) => {
    return (
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day
    );
  };

  // 달력 그리드 생성
  const generateCalendarGrid = () => {
    const grid = [];

    // 이전 달의 빈 칸들
    for (let i = 0; i < firstDayWeekday; i++) {
      grid.push(null);
    }

    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      grid.push(day);
    }

    return grid;
  };

  const calendarGrid = generateCalendarGrid();

  return (
    <div
      className={cn(
        "inline-flex w-96 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-[1.4px] border-[#C68D82] bg-white py-3",
        className
      )}
    >
      {/* 헤더 */}
      <div className="inline-flex items-center justify-between self-stretch py-1 pl-4 pr-3">
        {/* 이전 버튼 */}
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-[100px] transition-colors hover:bg-gray-100"
        >
          <ChevronDown className="-rotate-90 text-zinc-800" size={24} />
        </button>

        {/* 년월 표시 */}
        <div className="inline-flex flex-col items-start justify-start gap-2.5">
          <div className="inline-flex items-center justify-center gap-2 overflow-hidden rounded-[100px] py-2.5 pl-2 pr-1">
            <div className="justify-center text-center font-['Roboto'] text-sm font-medium leading-tight tracking-tight text-zinc-800">
              {year}년 {MONTHS[month]}
            </div>
          </div>
        </div>

        {/* 다음 버튼 */}
        <button
          type="button"
          onClick={goToNextMonth}
          className="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-[100px] transition-colors hover:bg-gray-100"
        >
          <ChevronDown className="rotate-90 text-zinc-800" size={24} />
        </button>
      </div>

      {/* 캘린더 그리드 */}
      <div className="flex flex-col items-center justify-start self-stretch px-3">
        {/* 요일 헤더 */}
        <div className="inline-flex h-12 items-start justify-center self-stretch">
          {DAYS_OF_WEEK.map((day, index) => (
            <div
              key={index}
              className="flex flex-1 items-center justify-center gap-2.5 self-stretch"
            >
              <div className="justify-center text-center font-['Roboto'] text-base font-normal leading-normal tracking-wide text-red-800">
                {day}
              </div>
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid w-full grid-cols-7 gap-0">
          {calendarGrid.map((day, index) => (
            <div
              key={index}
              className="inline-flex h-12 items-start justify-center"
            >
              {day ? (
                <div className="flex flex-1 items-center justify-center gap-2.5 self-stretch">
                  <button
                    type="button"
                    onClick={() => selectDate(day)}
                    className={cn(
                      "group flex h-10 w-10 items-center justify-center gap-2.5 overflow-hidden rounded-[100px] transition-colors",
                      isSelected(day)
                        ? "border border-[#911A00]"
                        : "hover:bg-red-800"
                    )}
                  >
                    <div className="flex h-10 w-10 items-center justify-center gap-2.5">
                      <div
                        className={cn(
                          'justify-center text-center font-["Roboto"] leading-normal tracking-wide transition-colors',
                          isSelected(day)
                            ? "text-sm font-medium leading-tight tracking-tight text-red-800"
                            : "text-base font-normal text-red-800 group-hover:text-white"
                        )}
                      >
                        {day}
                      </div>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 self-stretch p-1">
                  <div className="flex h-10 w-10 items-center justify-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center gap-2.5 p-2.5">
                      <div className="h-6 w-5"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="inline-flex items-start justify-between self-stretch px-3">
        <div className="flex flex-1 items-start justify-end gap-2">
          <button
            type="button"
            onClick={() => onConfirm?.(selectedDate)}
            className="inline-flex h-10 flex-col items-center justify-center gap-2 overflow-hidden rounded-[100px]"
          >
            <div className="inline-flex flex-1 items-center justify-center gap-2 self-stretch px-3 py-2.5">
              <div className="justify-center text-center font-['Roboto'] text-sm font-bold leading-tight tracking-tight text-red-800">
                확인
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 flex-col items-center justify-center gap-2 overflow-hidden rounded-[100px]"
          >
            <div className="inline-flex flex-1 items-center justify-center gap-2 self-stretch px-3 py-2.5">
              <div className="justify-center text-center font-['Roboto'] text-sm font-medium leading-tight tracking-tight text-red-800">
                취소
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
