"use client";

import { useState } from "react";
import MainBannerManagement from "./components/MainBannerManagement";
import AdBannerManagement from "./components/AdBannerManagement";
import FooterManagement from "./components/FooterManagement";

type TabType = "banner" | "ad" | "footer";

export default function AdminMainConfigPage() {
  const [activeTab, setActiveTab] = useState<TabType>("banner");

  const tabs = [
    { id: "banner" as TabType, label: "배너 관리" },
    { id: "ad" as TabType, label: "광고 배너" },
    { id: "footer" as TabType, label: "푸터 관리" },
  ];

  return (
    <div className="flex w-full flex-col items-start gap-8 p-11">
      <h1 className="font-pretendard text-2xl font-bold leading-8 text-gray-1">
        메인 구성 관리
      </h1>

      {/* 탭 네비게이션 */}
      <div className="flex w-full gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-pretendard text-base font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      <div className="w-full">
        {activeTab === "banner" && <MainBannerManagement />}
        {activeTab === "ad" && <AdBannerManagement />}
        {activeTab === "footer" && <FooterManagement />}
      </div>
    </div>
  );
}
