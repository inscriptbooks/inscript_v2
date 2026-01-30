"use client";

import { useState, useEffect } from "react";
import { Pagination } from "@/components/common";
import { useLoader } from "@/hooks/common";
import { ActivityLog, ActivityResponse } from "../types";

interface ActivitySectionProps {
  userId: string;
}

export default function ActivitySection({ userId }: ActivitySectionProps) {
  const { showLoader, hideLoader } = useLoader();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async (page: number) => {
    setLoading(true);
    showLoader();
    
    const response = await fetch(
      `/api/admin/members/${userId}/activities?page=${page}&limit=5`
    );
    const data: ActivityResponse = await response.json();

    setActivities(data.activities || []);
    setCurrentPage(data.pagination?.currentPage || 1);
    setTotalPages(data.pagination?.totalPages || 0);
    setLoading(false);
    hideLoader();
  };

  useEffect(() => {
    fetchActivities(1);

    return () => {
      hideLoader();
    };
  }, [userId]);

  const handlePageChange = (page: number) => {
    fetchActivities(page);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}-${hours}:${minutes}:${seconds}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="font-pretendard text-xl font-bold text-gray-1">
          활동 정보
        </h2>
        <div className="flex items-center justify-center py-10">
          <span className="font-pretendard text-base text-gray-3">
            로딩 중...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-pretendard text-xl font-bold text-gray-1">
        활동 정보
      </h2>
      <div className="flex flex-col">
        {/* 테이블 헤더 */}
        <div className="flex items-center bg-gray-7">
          <div className="flex w-52 items-center justify-center py-4">
            <span className="font-pretendard text-base font-normal text-gray-2">
              종류
            </span>
          </div>
          <div className="flex w-52 items-center justify-center py-4">
            <span className="font-pretendard text-base font-normal text-gray-2">
              날짜
            </span>
          </div>
          <div className="flex flex-1 items-center justify-center py-4">
            <span className="font-pretendard text-base font-normal text-gray-2">
              내용
            </span>
          </div>
        </div>

        {/* 테이블 본문 */}
        <div className="flex flex-col">
          {activities.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <span className="font-pretendard text-base text-gray-3">
                활동 내역이 없습니다.
              </span>
            </div>
          ) : (
            activities.map((log) => (
              <div key={log.id} className="flex items-center border-b border-gray-7">
                <div className="flex w-52 items-center justify-center py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-1">
                    {log.type}
                  </span>
                </div>
                <div className="flex w-52 items-center justify-center py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-1">
                    {formatDate(log.date)}
                  </span>
                </div>
                <div className="flex flex-1 items-center justify-center py-2.5">
                  <span className="font-pretendard text-base font-normal text-gray-1">
                    {log.content}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 0 && (
        <div className="flex items-center justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
