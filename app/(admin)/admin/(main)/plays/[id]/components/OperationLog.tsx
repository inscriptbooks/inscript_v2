"use client";

import Excel from "@/components/icons/Excel";
import * as XLSX from "xlsx";

interface LogData {
  date: string;
  email: string;
  event: string;
}

interface OperationLogProps {
  logData: LogData[];
}

export default function OperationLog({ logData }: OperationLogProps) {
  const handleExcelDownload = () => {
    // 엑셀 데이터 준비
    const excelData = logData.map((log) => ({
      "신청 일자": log.date,
      이메일: log.email,
      "이벤트 유형": log.event,
    }));

    // 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // 컬럼 너비 설정
    worksheet["!cols"] = [
      { wch: 20 }, // 신청 일자
      { wch: 30 }, // 이메일
      { wch: 20 }, // 이벤트 유형
    ];

    // 워크북 생성
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "운영로그");

    // 파일명 생성 (현재 날짜 포함)
    const today = new Date();
    const fileName = `운영로그_${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}.xlsx`;

    // 파일 다운로드
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold leading-6 text-gray-1">운영로그</h2>
        <button
          onClick={handleExcelDownload}
          className="flex items-center gap-3 rounded border-2 border-[#4CA452] bg-white px-3 py-2.5 text-sm font-semibold leading-4 text-[#4CA452] hover:bg-white/90 transition-colors"
        >
          <Excel size={16} />
          엑셀 다운로드
        </button>
      </div>

      <div className="flex flex-col bg-white">
        {/* 헤더 */}
        <div className="flex items-center border-b border-gray-7 bg-gray-7 px-6 py-2.5">
          <div className="flex-1 text-center text-sm font-medium leading-4">
            신청 일자
          </div>
          <div className="flex-1 text-center text-base font-normal leading-6">
            이메일
          </div>
          <div className="flex-1 text-center text-base font-normal leading-6">
            이벤트 유형
          </div>
        </div>

        {/* 로그 목록 */}
        {logData.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-base text-gray-4">
              운영 로그가 없습니다.
            </p>
          </div>
        ) : (
          logData.map((log, index) => (
            <div
              key={index}
              className="flex items-center border-b border-gray-7 px-6 py-2.5"
            >
              <div className="flex-1 text-center text-sm font-medium leading-4">
                {log.date}
              </div>
              <div className="flex-1 text-center text-sm font-medium leading-4">
                {log.email}
              </div>
              <div className="flex-1 text-center text-base font-normal leading-6">
                {log.event}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
