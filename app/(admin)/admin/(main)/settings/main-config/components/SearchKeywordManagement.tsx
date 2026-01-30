"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { showErrorToast } from "@/components/ui/toast";
import { useLoader } from "@/hooks/common";

interface SearchKeywordStat {
  keyword: string;
  count: number;
}

export default function SearchKeywordManagement() {
  const [topKeywords, setTopKeywords] = useState<SearchKeywordStat[]>([]);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    fetchSearchKeywordStats();
  }, []);

  const fetchSearchKeywordStats = async () => {
    showLoader();
    try {
      const response = await fetch("/api/admin/dashboard/search-keywords");
      const result = await response.json();

      if (result.keywords) {
        setTopKeywords(result.keywords);
      }
    } catch (error) {
      showErrorToast("데이터를 불러오는데 실패했습니다.");
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-10 self-stretch rounded-md bg-white p-11">
      <div className="gap-15 flex flex-col items-start self-stretch">
        <div className="flex flex-col items-start gap-4 self-stretch">
          <div className="flex flex-col items-start gap-2 self-stretch">
            <h2 className="font-pretendard text-xl font-bold text-gray-1">
              검색 키워드 통계 (TOP 10)
            </h2>
            <p className="font-pretendard text-base font-normal text-gray-2">
              사용자들의 검색 통계를 기반으로 TOP 10 키워드가 자동으로
              집계됩니다.
              <br />
              메인 페이지에서는 이 중 <strong>랜덤으로 1개씩</strong>{" "}
              표시됩니다. (새로고침/재방문 시 변경)
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 self-stretch">
            {/* TOP 10 통계 테이블 */}
            <div className="flex flex-col gap-2 self-stretch mt-4">
              <span className="font-pretendard text-sm font-semibold text-gray-3">
                검색 키워드 TOP 10 통계
              </span>
              <div className="flex flex-col border border-gray-200 rounded-md">
                {/* 헤더 */}
                <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <span className="w-12 text-sm font-bold text-gray-4">
                    순위
                  </span>
                  <span className="flex-1 text-sm font-bold text-gray-4">
                    키워드
                  </span>
                  <span className="w-20 text-right text-sm font-bold text-gray-4">
                    검색 수
                  </span>
                </div>
                {/* 데이터 */}
                <div className="flex flex-col">
                  {topKeywords.length > 0 ? (
                    topKeywords.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                      >
                        <span className="w-12 text-center text-base font-normal text-gray-3">
                          {index + 1}
                        </span>
                        <span className="flex-1 text-sm font-normal text-gray-2">
                          {item.keyword}
                        </span>
                        <span className="w-20 text-right text-sm font-bold text-primary">
                          {item.count}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <span className="text-sm text-gray-400">
                        검색 통계 데이터가 없습니다.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end self-stretch">
        <Button
          onClick={fetchSearchKeywordStats}
          size="sm"
          className="h-9 w-20 bg-primary"
        >
          새로고침
        </Button>
      </div>
    </div>
  );
}
