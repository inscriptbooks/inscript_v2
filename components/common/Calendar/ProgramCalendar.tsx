"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetPrograms } from "@/hooks/programs";
import { Program } from "@/models/program";
import { useLoader } from "@/hooks/common";

interface CalendarEvent {
  id: string;
  title: string;
  program: Program;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday?: boolean;
  isHighlighted?: boolean;
  events: CalendarEvent[];
}

interface ProgramCalendarProps {
  className?: string;
  status?: "ongoing" | "closed";
}

const monthNames = [
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

const dayNames = ["월", "화", "수", "목", "금", "토", "일"];

export default function ProgramCalendar({
  className,
  status = "ongoing",
}: ProgramCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { showLoader, hideLoader } = useLoader();

  // 연도별로 1년치 프로그램 데이터를 한 번에 가져오기
  const { data: programsData, isLoading } = useGetPrograms({
    status,
    year: currentDate.getFullYear(),
    isVisible: true,
  });

  const allPrograms = programsData?.programs || [];

  // 현재 월에 해당하는 프로그램만 필터링
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const programs = allPrograms.filter((program) => {
    const eventDate = new Date(program.eventDateTime);
    return (
      eventDate.getMonth() === currentMonth &&
      eventDate.getFullYear() === currentYear
    );
  });

  // 프로그램들을 날짜별로 그룹화
  const getProgramsByDate = () => {
    const programsByDate: Record<string, CalendarEvent[]> = {};

    programs.forEach((program) => {
      const eventDate = new Date(program.eventDateTime);
      const dateKey = `${eventDate.getFullYear()}-${eventDate.getMonth()}-${eventDate.getDate()}`;

      if (!programsByDate[dateKey]) {
        programsByDate[dateKey] = [];
      }

      programsByDate[dateKey].push({
        id: program.id,
        title: program.title,
        program,
      });
    });

    return programsByDate;
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    const programsByDate = getProgramsByDate();

    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);

    // Get the first Monday of the calendar view
    const dayOfWeek = (firstDay.getDay() + 6) % 7;
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const days: CalendarDay[] = [];
    const currentDateIter = new Date(startDate);

    // Generate 35 days (5 weeks)
    for (let i = 0; i < 35; i++) {
      const date = currentDateIter.getDate();
      const isCurrentMonth = currentDateIter.getMonth() === month;
      const isToday =
        currentDateIter.getFullYear() === today.getFullYear() &&
        currentDateIter.getMonth() === today.getMonth() &&
        currentDateIter.getDate() === today.getDate();

      const dateKey = `${currentDateIter.getFullYear()}-${currentDateIter.getMonth()}-${currentDateIter.getDate()}`;
      const events = programsByDate[dateKey] || [];

      days.push({
        date,
        isCurrentMonth,
        isToday,
        isHighlighted: isToday,
        events: isCurrentMonth ? events : [],
      });

      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const calendarDays = generateCalendarDays();

  const EventTag = ({ event }: { event: CalendarEvent }) => {
    return (
      <Link
        href={`/program/${event.program.id}`}
        className="flex cursor-pointer rounded bg-[#ECE5E4] px-0.5 py-0.5 transition-opacity hover:opacity-80 lg:px-1 lg:py-0.5"
      >
        <span className="line-clamp-1 text-[10px] font-medium text-primary lg:text-base">
          {event.title}
        </span>
      </Link>
    );
  };

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-6 shadow-[0_1px_1px_0_rgba(0,0,0,0.12)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-[28px] font-bold leading-[130%] text-primary">
          {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth("prev")}
            className="flex h-6 w-6 items-center justify-center transition-opacity disabled:opacity-40"
            aria-label="이전 달"
            disabled={isLoading}
          >
            <ChevronLeft className="h-6 w-6 text-gray-2" strokeWidth={1.6} />
          </button>
          <span className="w-8 text-center font-pretendard text-base font-medium leading-5 text-gray-2">
            {currentDate.getMonth() + 1}월
          </span>
          <button
            onClick={() => navigateMonth("next")}
            className="flex h-6 w-6 items-center justify-center transition-opacity disabled:opacity-40"
            aria-label="다음 달"
            disabled={isLoading}
          >
            <ChevronRight className="h-6 w-6 text-gray-2" strokeWidth={1.6} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex flex-col">
        {/* Day Headers */}
        <div className="flex bg-[#FAFAFA]">
          {dayNames.map((day) => (
            <div
              key={day}
              className="flex flex-1 items-start border border-[#E8E8E8] bg-primary p-3"
            >
              <span className="text-[10px] font-medium text-white lg:text-base">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid flex-1 grid-cols-7 grid-rows-5">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={cn(
                "flex min-h-[61.5px] flex-1 flex-col justify-between border border-[#E8E8E8] p-0.5 sm:min-h-[102px] md:min-h-[102px] lg:min-h-[149.4px] lg:p-3",
                day.isCurrentMonth ? "bg-white" : "bg-[#F8F8F8]",
                day.isHighlighted && "bg-orange-2"
              )}
            >
              <span
                className={cn(
                  "text-[10px] font-medium lg:text-base",
                  day.isCurrentMonth ? "text-black" : "text-black opacity-40",
                  day.isHighlighted && "text-white"
                )}
              >
                {day.date}
              </span>

              {/* Events */}
              <div className="flex flex-col gap-1.5 p-0.5">
                {day.events.map((event) => (
                  <EventTag key={event.id} event={event} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
