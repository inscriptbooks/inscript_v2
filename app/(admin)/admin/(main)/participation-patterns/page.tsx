"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import DateEdit from "@/components/ui/date-edit";
import ParticipationChart from "./components/ParticipationChart";
import Calendar from "@/components/icons/Calendar";
import type { ChartDataPoint } from "./types";

type MemberType = "일반회원" | "작가회원" | "멤버십회원" | "비회원";
type PeriodType = "일간" | "주간" | "월간";

export default function AdminParticipationPatternsPage() {
  // 오늘 기준 12일간 기본 설정
  const getDefaultDates = () => {
    const today = new Date();
    const elevenDaysAgo = new Date(today);
    elevenDaysAgo.setDate(today.getDate() - 11);
    return { start: elevenDaysAgo, end: today };
  };

  const defaultDates = getDefaultDates();
  
  const [activeMemberType, setActiveMemberType] =
    useState<MemberType>("일반회원");
  const [activePeriod, setActivePeriod] = useState<PeriodType>("일간");
  const [startDate, setStartDate] = useState<Date>(defaultDates.start);
  const [endDate, setEndDate] = useState<Date>(defaultDates.end);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  
  const [programData, setProgramData] = useState<ChartDataPoint[]>([]);
  const [memoData, setMemoData] = useState<ChartDataPoint[]>([]);
  const [playData, setPlayData] = useState<ChartDataPoint[]>([]);
  const [postData, setPostData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const startDateRef = useRef<HTMLDivElement>(null);
  const endDateRef = useRef<HTMLDivElement>(null);

  const memberTypes: MemberType[] = ["일반회원", "작가회원"];
  const periods: PeriodType[] = ["일간", "주간", "월간"];

  const chartSections = [
    { title: "프로그램 신청", id: "program" },
    { title: "메모", id: "memo" },
    { title: "희곡 등록 신청", id: "play" },
    { title: "커뮤니티 게시글 작성", id: "community" },
  ];

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        startDateRef.current &&
        !startDateRef.current.contains(event.target as Node)
      ) {
        setIsStartDateOpen(false);
      }
      if (
        endDateRef.current &&
        !endDateRef.current.contains(event.target as Node)
      ) {
        setIsEndDateOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 날짜 포맷팅 함수
  const formatDate = (date: Date | null) => {
    if (!date) return "날짜 입력";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 주차 계산 함수
  const getWeekOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfMonth = date.getDate();
    const firstDayOfWeek = firstDay.getDay();
    return Math.ceil((dayOfMonth + firstDayOfWeek) / 7);
  };

  // 데이터 가져오기
  const fetchData = useCallback(async () => {
    if (!startDate || !endDate) return;
    
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        memberType: activeMemberType,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const response = await fetch(`/api/admin/participation-patterns?${params}`);
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      
      // 기간 타입에 따라 다르게 집계
      const aggregateData = (items: any[]) => {
        if (activePeriod === "일간") {
          // 일별 집계
          const dateMap = new Map<string, number>();
          
          // 12일간의 모든 날짜 초기화
          const current = new Date(startDate);
          while (current <= endDate) {
            const dateStr = current.toISOString().split('T')[0];
            dateMap.set(dateStr, 0);
            current.setDate(current.getDate() + 1);
          }
          
          // 데이터 집계
          items.forEach((item) => {
            const date = new Date(item.created_at).toISOString().split('T')[0];
            if (dateMap.has(date)) {
              dateMap.set(date, (dateMap.get(date) || 0) + 1);
            }
          });
          
          // ChartDataPoint 형식으로 변환
          const result: ChartDataPoint[] = [];
          const sortedDates = Array.from(dateMap.keys()).sort();
          
          sortedDates.forEach((dateStr, index) => {
            const date = new Date(dateStr);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const isFirstOfMonth = day === 1 || index === 0;
            const todayStr = new Date().toISOString().split('T')[0];
            const isToday = dateStr === todayStr;
            
            result.push({
              date: `${day}일`,
              month: isFirstOfMonth ? `${month}월` : undefined,
              value: dateMap.get(dateStr) || 0,
              isHighlighted: isToday,
            });
          });
          
          return result;
        } else if (activePeriod === "주간") {
          // 주차별 집계
          const weekMap = new Map<string, number>();
          
          // 12주간의 모든 주차 초기화
          const weeks: string[] = [];
          const current = new Date(endDate);
          
          for (let i = 0; i < 12; i++) {
            const year = current.getFullYear();
            const month = current.getMonth() + 1;
            const week = getWeekOfMonth(current);
            const weekKey = `${year}-${month}-${week}`;
            const weekLabel = `${month}월${week}주차`;
            
            if (!weeks.includes(weekLabel)) {
              weeks.unshift(weekLabel);
              weekMap.set(weekLabel, 0);
            }
            
            current.setDate(current.getDate() - 7);
          }
          
          // 데이터 집계
          items.forEach((item) => {
            const date = new Date(item.created_at);
            const month = date.getMonth() + 1;
            const week = getWeekOfMonth(date);
            const weekLabel = `${month}월${week}주차`;
            
            if (weekMap.has(weekLabel)) {
              weekMap.set(weekLabel, (weekMap.get(weekLabel) || 0) + 1);
            }
          });
          
          // ChartDataPoint 형식으로 변환
          const result: ChartDataPoint[] = weeks.map((weekLabel, index) => {
            const currentWeek = new Date();
            const currentMonth = currentWeek.getMonth() + 1;
            const currentWeekNum = getWeekOfMonth(currentWeek);
            const isCurrentWeek = weekLabel === `${currentMonth}월${currentWeekNum}주차`;
            
            return {
              date: weekLabel,
              value: weekMap.get(weekLabel) || 0,
              isHighlighted: isCurrentWeek,
            };
          });
          
          return result;
        } else {
          // 월별 집계
          const monthMap = new Map<string, number>();
          
          // 12개월간의 모든 월 초기화
          const months: string[] = [];
          const current = new Date(endDate);
          
          for (let i = 0; i < 12; i++) {
            const year = current.getFullYear();
            const month = current.getMonth() + 1;
            const monthLabel = `${month}월`;
            
            months.unshift(monthLabel);
            monthMap.set(monthLabel, 0);
            
            current.setMonth(current.getMonth() - 1);
          }
          
          // 데이터 집계
          items.forEach((item) => {
            const date = new Date(item.created_at);
            const month = date.getMonth() + 1;
            const monthLabel = `${month}월`;
            
            if (monthMap.has(monthLabel)) {
              monthMap.set(monthLabel, (monthMap.get(monthLabel) || 0) + 1);
            }
          });
          
          // ChartDataPoint 형식으로 변환
          const currentMonth = new Date().getMonth() + 1;
          const result: ChartDataPoint[] = months.map((monthLabel) => {
            const isCurrentMonth = monthLabel === `${currentMonth}월`;
            
            return {
              date: monthLabel,
              value: monthMap.get(monthLabel) || 0,
              isHighlighted: isCurrentMonth,
            };
          });
          
          return result;
        }
      };
      
      setProgramData(aggregateData(data.programs || []));
      setMemoData(aggregateData(data.memos || []));
      setPlayData(aggregateData(data.plays || []));
      setPostData(aggregateData(data.posts || []));
    } catch (error) {
      // 에러 처리
    } finally {
      setIsLoading(false);
    }
  }, [activeMemberType, startDate, endDate, activePeriod]);

  // 필터 변경 시 데이터 다시 가져오기
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 기간 변경 시 날짜 자동 조정
  const handlePeriodChange = (period: PeriodType) => {
    setActivePeriod(period);
    const today = new Date();
    let newStartDate = new Date(today);
    
    if (period === "일간") {
      newStartDate.setDate(today.getDate() - 11); // 12일간
    } else if (period === "주간") {
      newStartDate.setDate(today.getDate() - (11 * 7)); // 12주간 (11주 * 7일)
    } else if (period === "월간") {
      newStartDate.setMonth(today.getMonth() - 11); // 12개월간
    }
    
    setStartDate(newStartDate);
    setEndDate(today);
  };

  return (
    <div className="p-8">
      <div className="flex w-full flex-col gap-8 rounded-[5px] bg-white p-11">
        {/* 헤더 */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="font-pretendard text-2xl font-bold leading-8 text-gray-1">
              회원별 참여 패턴
            </h1>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center border-b border-red-3 px-3">
              {memberTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveMemberType(type)}
                  className={`flex flex-1 items-center justify-center gap-2.5 p-2.5 ${
                    activeMemberType === type
                      ? "border-b border-primary text-primary"
                      : "text-orange-2"
                  }`}
                >
                  <span className="text-center font-pretendard text-base font-normal leading-5">
                    {type}
                  </span>
                </button>
              ))}
            </div>

            {/* 필터 섹션 */}
            <div className="flex w-[560px] items-center justify-between">
              {/* 기간 필터 */}
              <div className="flex items-center gap-3">
                {periods.map((period) => (
                  <Badge
                    key={period}
                    variant={activePeriod === period ? "default" : "outline"}
                    size="default"
                    className={`cursor-pointer rounded-full px-3 py-1.5 ${
                      activePeriod === period
                        ? "bg-primary text-white"
                        : "border border-primary bg-white text-primary"
                    }`}
                    onClick={() => handlePeriodChange(period)}
                  >
                    <span className="font-pretendard text-sm font-normal leading-4">
                      {period}
                    </span>
                  </Badge>
                ))}
              </div>

              {/* 날짜 선택 */}
              <div className="flex items-center gap-2">
                <span className="font-pretendard text-sm font-bold leading-4 tracking-[-0.28px] text-gray-2">
                  기간 선택
                </span>
                <div className="flex w-[306px] items-center gap-2.5">
                  {/* 시작일 */}
                  <div ref={startDateRef} className="relative">
                    <button
                      onClick={() => {
                        setIsStartDateOpen(!isStartDateOpen);
                        setIsEndDateOpen(false);
                      }}
                      className="flex h-10 w-[140px] items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      <span className="font-bold text-primary">
                        {formatDate(startDate)}
                      </span>
                      <Calendar className="h-4 w-4 text-gray-500" />
                    </button>
                    {isStartDateOpen && (
                      <div className="absolute left-0 top-12 z-50">
                        <DateEdit
                          value={startDate}
                          onChange={(date) => setStartDate(date)}
                          onConfirm={(date) => {
                            setStartDate(date);
                            setIsStartDateOpen(false);
                          }}
                          onCancel={() => setIsStartDateOpen(false)}
                        />
                      </div>
                    )}
                  </div>
                  <span className="text-center font-pretendard text-xs font-bold leading-normal text-gray-3">
                    -
                  </span>
                  {/* 종료일 */}
                  <div ref={endDateRef} className="relative">
                    <button
                      onClick={() => {
                        setIsEndDateOpen(!isEndDateOpen);
                        setIsStartDateOpen(false);
                      }}
                      className="flex h-10 w-[140px] items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      <span
                        className={
                          endDate ? "font-bold text-primary" : "text-gray-400"
                        }
                      >
                        {formatDate(endDate)}
                      </span>
                      <Calendar className="h-4 w-4 text-gray-500" />
                    </button>
                    {isEndDateOpen && (
                      <div className="absolute left-0 top-12 z-50">
                        <DateEdit
                          value={endDate || new Date()}
                          onChange={(date) => setEndDate(date)}
                          onConfirm={(date) => {
                            setEndDate(date);
                            setIsEndDateOpen(false);
                          }}
                          onCancel={() => setIsEndDateOpen(false)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 차트 섹션 */}
        {isLoading ? (
          <div className="flex h-[500px] items-center justify-center">
            <p className="text-gray-400">데이터를 불러오는 중...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {chartSections.map((section) => (
              <div key={section.id} className="flex h-[270px] flex-col gap-5">
                <h2 className="font-pretendard text-2xl font-bold leading-[150%] tracking-[-0.48px] text-gray-2">
                  {section.title}
                </h2>
                <ParticipationChart 
                  data={
                    section.id === "program" ? programData :
                    section.id === "memo" ? memoData :
                    section.id === "play" ? playData :
                    postData
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
