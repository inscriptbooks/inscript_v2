"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLoader } from "@/hooks/common";
import MemberReportChart from "./components/MemberReportChart";
import MemberTrendChart from "./components/MemberTrendChart";
import ProgramApplicationsTable from "./components/ProgramApplicationsTable";
import { DashboardStats, ProgramApplication, SearchKeyword } from "./types";

async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/admin/dashboard/stats`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return {
        users: { new: 0, total: 0 },
        plays: { new: 0, total: 0 },
        authors: { new: 0, total: 0 },
        posts: { newPosts: 0, newComments: 0 },
        reports: { new: 0, incomplete: 0 },
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      users: { new: 0, total: 0 },
      plays: { new: 0, total: 0 },
      authors: { new: 0, total: 0 },
      posts: { newPosts: 0, newComments: 0 },
      reports: { new: 0, incomplete: 0 },
    };
  }
}

async function getProgramApplications(): Promise<ProgramApplication[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/admin/dashboard/program-applications`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.applications || [];
  } catch (error) {
    return [];
  }
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();
  const [stats, setStats] = useState<DashboardStats>({
    users: { new: 0, total: 0 },
    plays: { new: 0, total: 0 },
    authors: { new: 0, total: 0 },
    posts: { newPosts: 0, newComments: 0 },
    reports: { new: 0, incomplete: 0 },
  });
  const [applications, setApplications] = useState<ProgramApplication[]>([]);
  const [searchKeywords, setSearchKeywords] = useState<SearchKeyword[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        showLoader();
        const [statsRes, appsRes, keywordsRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/admin/dashboard/stats`,
            { cache: "no-store" }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/admin/dashboard/program-applications`,
            { cache: "no-store" }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/admin/dashboard/search-keywords`,
            { cache: "no-store" }
          ),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (appsRes.ok) {
          const appsData = await appsRes.json();
          setApplications(appsData.applications || []);
        }

        if (keywordsRes.ok) {
          const keywordsData = await keywordsRes.json();
          setSearchKeywords(keywordsData.keywords || []);
        }
      } catch (error) {
        // 에러 처리
      } finally {
        setIsLoading(false);
        hideLoader();
      }
    };

    loadData();
  }, []);

  return (
    <div className="flex w-full flex-col items-start gap-11 p-8 pl-11 pr-11">
      {/* 제목 */}
      <h1 className="self-stretch text-2xl font-bold leading-8 text-gray-1">
        Weekly 리포트
      </h1>

      {/* 메인 콘텐츠 */}
      <div className="flex flex-1 flex-col items-start gap-6 self-stretch">
        {/* 첫 번째 행: 통계 카드들 */}
        <div className="flex h-[427px] items-center gap-6 self-stretch">
          <div className="flex flex-1 flex-col gap-6 self-stretch">
            {/* 첫 번째 행의 3개 카드 */}
            <div className="flex flex-1 items-center gap-6">
              {/* 회원 현황 카드 */}
              <Card className="flex w-1/3 flex-col items-start gap-5 bg-white p-7 px-8">
                <h3 className="self-stretch text-lg font-bold leading-6 text-primary">
                  회원 현황
                </h3>
                <div className="flex flex-col items-center gap-3.5 self-stretch">
                  <div className="flex flex-col items-start gap-1 self-stretch">
                    <div className="flex items-center justify-between self-stretch">
                      <span className="text-sm font-normal leading-4 text-gray-1 opacity-70">
                        신규
                      </span>
                      <span className="text-center text-xl font-normal leading-6 tracking-[-0.4px] text-gray-1">
                        {stats.users.new}명
                      </span>
                    </div>
                    <div className="flex items-center justify-between self-stretch">
                      <span className="text-sm font-normal leading-4 text-gray-1 opacity-70">
                        전체
                      </span>
                      <span className="text-center text-xl font-normal leading-6 tracking-[-0.4px] text-gray-3">
                        {stats.users.total.toLocaleString()}명
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push("/admin/members")}
                    className="flex h-auto w-full items-center justify-center gap-1.5 self-stretch rounded bg-primary px-3 py-2.5 text-sm font-bold leading-4 tracking-[-0.28px] text-white"
                  >
                    회원 관리
                    <Image
                      src="/images_jj/arrow.svg"
                      alt="arrow_right"
                      width={16}
                      height={16}
                    />
                  </Button>
                </div>
              </Card>

              {/* 희곡 데이터 카드 */}
              <Card className="flex w-1/3 flex-col items-start gap-5 bg-white p-7 px-8">
                <h3 className="self-stretch text-lg font-bold leading-6 text-primary">
                  희곡 데이터
                </h3>
                <div className="flex flex-col items-center gap-3.5 self-stretch">
                  <div className="flex flex-col items-start gap-1 self-stretch">
                    <div className="flex items-center justify-between self-stretch">
                      <span className="text-sm font-normal leading-4 text-gray-1 opacity-70">
                        신규
                      </span>
                      <span className="text-center text-xl font-normal leading-6 tracking-[-0.4px] text-gray-1">
                        {stats.plays.new}편
                      </span>
                    </div>
                    <div className="flex items-center justify-between self-stretch">
                      <span className="text-sm font-normal leading-4 text-gray-1 opacity-70">
                        전체
                      </span>
                      <span className="text-center text-xl font-normal leading-6 tracking-[-0.4px] text-gray-3">
                        {stats.plays.total.toLocaleString()}편
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push("/admin/plays")}
                    className="flex h-auto w-full items-center justify-center gap-1.5 self-stretch rounded bg-primary px-3 py-2.5 text-sm font-bold leading-4 tracking-[-0.28px] text-white"
                  >
                    희곡 관리
                    <Image
                      src="/images_jj/arrow.svg"
                      alt="arrow_right"
                      width={16}
                      height={16}
                    />
                  </Button>
                </div>
              </Card>

              {/* 작가 데이터 카드 */}
              <Card className="flex w-1/3 flex-col items-start gap-5 bg-white p-7 px-8">
                <h3 className="self-stretch text-lg font-bold leading-6 text-primary">
                  작가 데이터
                </h3>
                <div className="flex flex-col items-center gap-3.5 self-stretch">
                  <div className="flex flex-col items-start gap-1 self-stretch">
                    <div className="flex items-center justify-between self-stretch">
                      <span className="text-sm font-normal leading-4 text-gray-1 opacity-70">
                        신규
                      </span>
                      <span className="text-center text-xl font-normal leading-6 tracking-[-0.4px] text-gray-1">
                        {stats.authors.new}명
                      </span>
                    </div>
                    <div className="flex items-center justify-between self-stretch">
                      <span className="text-sm font-normal leading-4 text-gray-1 opacity-70">
                        전체
                      </span>
                      <span className="text-center text-xl font-normal leading-6 tracking-[-0.4px] text-gray-3">
                        {stats.authors.total.toLocaleString()}명
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push("/admin/writers")}
                    className="flex h-auto w-full items-center justify-center gap-1.5 self-stretch rounded bg-primary px-3 py-2.5 text-sm font-bold leading-4 tracking-[-0.28px] text-white"
                  >
                    작가 관리
                    <Image
                      src="/images_jj/arrow.svg"
                      alt="arrow_right"
                      width={16}
                      height={16}
                    />
                  </Button>
                </div>
              </Card>
            </div>

            {/* 두 번째 행 */}
            <div className="flex flex-1 items-center gap-6">
              {/* 커뮤니티 활동 카드 */}
              <Card className="flex flex-1 flex-col items-start gap-5 bg-white p-7 px-8">
                <h3 className="self-stretch text-lg font-bold leading-6 text-primary">
                  커뮤니티 활동
                </h3>
                <div className="flex flex-col items-center gap-3.5 self-stretch">
                  <div className="flex flex-col items-start gap-1 self-stretch">
                    <div className="flex items-center justify-between self-stretch">
                      <span className="text-sm font-normal leading-4 text-gray-1 opacity-70">
                        신규 글
                      </span>
                      <span className="text-center text-xl font-normal leading-6 tracking-[-0.4px] text-gray-1">
                        {stats.posts.newPosts}건
                      </span>
                    </div>
                    <div className="flex items-center justify-between self-stretch">
                      <span className="text-sm font-normal leading-4 text-gray-1 opacity-70">
                        신규 댓글
                      </span>
                      <span className="text-center text-xl font-normal leading-6 tracking-[-0.4px] text-gray-3">
                        {stats.posts.newComments}건
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push("/admin/community2")}
                    className="flex h-auto w-full items-center justify-center gap-1.5 self-stretch rounded bg-primary px-3 py-2.5 text-sm font-bold leading-4 tracking-[-0.28px] text-white"
                  >
                    커뮤니티 관리
                    <Image
                      src="/images_jj/arrow.svg"
                      alt="arrow_right"
                      width={16}
                      height={16}
                    />
                  </Button>
                </div>
              </Card>

              {/* 신고 접수 카드 */}
              <Card className="flex flex-1 flex-col items-start gap-5 bg-white p-7 px-8">
                <h3 className="self-stretch text-lg font-bold leading-6 text-primary">
                  신고 접수
                </h3>
                <div className="flex flex-col items-center gap-3.5 self-stretch">
                  <div className="flex flex-col items-start gap-1 self-stretch">
                    <div className="flex items-center justify-between self-stretch">
                      <span className="text-sm font-normal leading-4 text-gray-1 opacity-70">
                        신규
                      </span>
                      <span className="text-center text-xl font-normal leading-6 tracking-[-0.4px] text-gray-1">
                        {stats.reports.new}건
                      </span>
                    </div>
                    <div className="flex items-center justify-between self-stretch">
                      <span className="text-sm font-normal leading-4 text-gray-1 opacity-70">
                        미처리
                      </span>
                      <span className="text-center text-xl font-normal leading-6 tracking-[-0.4px] text-gray-3">
                        {stats.reports.incomplete}건
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push("/admin/reports")}
                    className="flex h-auto w-full items-center justify-center gap-1.5 self-stretch rounded bg-primary px-3 py-2.5 text-sm font-bold leading-4 tracking-[-0.28px] text-white"
                  >
                    신고 관리
                    <Image
                      src="/images_jj/arrow.svg"
                      alt="arrow_right"
                      width={16}
                      height={16}
                    />
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* 작품별 인기도/검색 통계 */}
          <Card className="flex w-[328px] flex-col items-center justify-start gap-2 self-stretch bg-white px-8 py-8 pl-6">
            <h3 className="self-stretch text-xl font-bold leading-6 text-black">
              작품별 인기도/검색 통계
            </h3>
            <div className="flex flex-col items-start self-stretch">
              {/* 헤더 */}
              <div className="flex items-center justify-between self-stretch px-0 py-2">
                <div className="flex flex-1 items-start gap-3 pl-1.5">
                  <span className="w-6 text-sm font-bold leading-4 tracking-[-0.28px] text-gray-4">
                    순번
                  </span>
                  <span className="flex-1 text-sm font-bold leading-4 tracking-[-0.28px] text-gray-4">
                    작품명
                  </span>
                </div>
                <span className="w-10 text-right text-sm font-bold leading-4 tracking-[-0.28px] text-gray-4">
                  검색 수
                </span>
              </div>

              {/* 데이터 행들 */}
              <div className="flex flex-col items-start self-stretch h-full">
                {searchKeywords.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between self-stretch px-0 py-1.5"
                  >
                    <div className="flex flex-1 items-center justify-center gap-3">
                      <span className="w-6 text-center text-base font-normal leading-5 text-gray-3">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-sm font-normal leading-4 text-gray-2">
                        {item.keyword}
                      </span>
                    </div>
                    <span className="w-10 text-right text-sm font-bold leading-4 tracking-[-0.28px] text-primary">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* 차트 섹션 */}
        <div className="flex flex-1 items-start gap-6 self-stretch">
          {/* 회원 리포트 차트 */}
          <Card className="flex flex-1 flex-col items-start gap-6 self-stretch bg-white p-11 px-11">
            <div className="flex flex-col items-start gap-6 self-stretch">
              <h3 className="text-xl font-bold leading-6 text-black">
                회원 리포트
              </h3>
            </div>
            <MemberReportChart />
          </Card>

          {/* 회원 추세 차트 */}
          <Card className="flex flex-1 flex-col items-start gap-6 self-stretch bg-white p-11 px-11">
            <div className="flex items-center justify-between self-stretch">
              <h3 className="text-xl font-bold leading-[30px] tracking-[-0.4px] text-black">
                회원 추세
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold leading-4 tracking-[-0.28px] text-gray-4">
                  전체
                </span>
                <span className="text-xl font-bold leading-6 text-black">
                  {stats.users.total.toLocaleString()}명
                </span>
              </div>
            </div>
            <MemberTrendChart />
          </Card>
        </div>

        {/* 프로그램 신청 현황 */}
        <ProgramApplicationsTable applications={applications} />
      </div>
    </div>
  );
}
