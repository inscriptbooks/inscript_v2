"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { ProgramApplication } from "../types";

interface ProgramApplicationsTableProps {
  applications: ProgramApplication[];
}

export default function ProgramApplicationsTable({
  applications,
}: ProgramApplicationsTableProps) {
  const router = useRouter();

  return (
    <Card className="flex flex-1 flex-col items-start gap-3 self-stretch bg-white p-8 px-6">
      <div className="flex items-start justify-between self-stretch">
        <h3 className="text-xl font-bold leading-[30px] tracking-[-0.4px] text-black">
          프로그램 신청 현황
        </h3>
        <Button 
          onClick={() => router.push("/admin/programs")}
          className="flex h-auto items-center justify-center gap-1.5 rounded bg-primary px-6 py-2.5 text-sm font-bold leading-4 tracking-[-0.28px] text-white"
        >
          프로그램 관리
          <Image
            src="/images_jj/arrow.svg"
            alt="arrow_right"
            width={16}
            height={16}
          />
        </Button>
      </div>
      <div className="flex flex-col items-start self-stretch">
        {applications.length > 0 ? (
          applications.map((item, index) => (
            <div
              key={index}
              className="flex items-center self-stretch border-b border-gray-7 px-6 py-2.5"
            >
              <span className="w-1/5 text-base font-normal leading-6 tracking-[-0.32px] text-gray-1 truncate">
                {item.email}
              </span>
              <span className="w-2/5 text-base font-normal leading-6 tracking-[-0.32px] text-gray-1 truncate">
                {item.title}
              </span>
              <div className="flex w-1/5 items-center justify-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gray-5" />
                <span className="text-center text-sm font-normal leading-4 text-gray-3">
                  {item.user}
                </span>
              </div>
              <span className="w-1/5 text-center text-sm font-normal leading-4 text-gray-4">
                {item.date}
              </span>
            </div>
          ))
        ) : (
          <div className="flex w-full items-center justify-center py-8">
            <span className="text-sm font-normal leading-4 text-gray-4">
              신청 현황이 없습니다
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
