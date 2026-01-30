"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import BannerCard from "./BannerCard";
import { Banner } from "../types";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";

interface BannerManagementProps {
  type: "main" | "ad";
  title: string;
  gridCols?: number;
}

export default function BannerManagement({
  type,
  title,
  gridCols = 3,
}: BannerManagementProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, [type]);

  const fetchBanners = async () => {
    try {
      const response = await fetch(`/api/admin/banners?type=${type}`);
      const result = await response.json();
      if (result.data) {
        setBanners(result.data);
      }
    } catch (error) {
      // Error silently handled
    } finally {
      setLoading(false);
    }
  };

  const handleAddBanner = async () => {
    try {
      const maxOrder =
        banners.length > 0
          ? Math.max(...banners.map((b) => b.display_order))
          : 0;

      const newBanner = {
        title: `배너 ${banners.length + 1}`,
        type,
        link_url: "https://",
        is_active: false,
        display_order: maxOrder + 1,
      };

      const response = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBanner),
      });

      const result = await response.json();
      if (result.data) {
        setBanners([...banners, result.data]);
      }
    } catch (error) {
      // Error silently handled
    }
  };

  const handleDeleteBanner = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBanners(banners.filter((banner) => banner.id !== id));
      }
    } catch (error) {
      // Error silently handled
    }
  };

  const updateBanner = async (id: string, updates: Partial<Banner>) => {
    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const result = await response.json();
      if (result.data) {
        setBanners(
          banners.map((banner) => (banner.id === id ? result.data : banner))
        );
      }
    } catch (error) {
      // Error silently handled
    }
  };

  const handleSave = async () => {
    showSuccessToast("저장되었습니다.");
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-10 self-stretch rounded-md bg-white p-11">
      <div className="flex flex-col items-start gap-8 self-stretch">
        <div className="flex items-center justify-between self-stretch">
          <h2 className="font-pretendard text-xl font-bold text-gray-1">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={handleAddBanner}
            className="flex h-[44px] w-[128px] items-center gap-2 rounded bg-red-2 hover:bg-red-2/90"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M11.9113 5.11523V18.6895M5.09375 12.0522H18.8485"
                stroke="#911A00"
                strokeWidth="1.6"
              />
            </svg>
            <span className="font-pretendard text-base font-normal text-primary">
              배너 추가
            </span>
          </Button>
          <span className="font-pretendard text-sm font-normal text-primary">
            10MB 이하의 파일만 첨부 가능합니다.
          </span>
        </div>

        <div
          className={`grid grid-cols-${gridCols} gap-4 self-stretch`}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
          }}
        >
          {banners.map((banner) => (
            <BannerCard
              key={banner.id}
              title={banner.title}
              imageUrl={banner.image_url}
              linkUrl={banner.link_url}
              startDate={banner.start_date || ""}
              endDate={banner.end_date || ""}
              isPublished={banner.is_active}
              onDelete={() => handleDeleteBanner(banner.id)}
              onImageChange={(url) =>
                updateBanner(banner.id, { image_url: url })
              }
              onLinkUrlChange={(url) =>
                updateBanner(banner.id, { link_url: url })
              }
              onStartDateChange={(date) =>
                updateBanner(banner.id, { start_date: date })
              }
              onEndDateChange={(date) =>
                updateBanner(banner.id, { end_date: date })
              }
              onPublishToggle={(published) =>
                updateBanner(banner.id, { is_active: published })
              }
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end self-stretch">
        {/* <Button
          variant="outline"
          size="sm"
          className="h-[36px] w-[94px] gap-1.5 rounded-[4px] bg-white hover:bg-white/90"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle
              cx="7.66732"
              cy="7.66732"
              r="6.33333"
              stroke="#555555"
              strokeWidth="1.6"
            />
            <path
              d="M12.334 12.334L14.6673 14.6673"
              stroke="#555555"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          미리보기
        </Button> */}
        <Button onClick={handleSave} size="sm" className="h-9 w-12 bg-primary">
          저장
        </Button>
      </div>
    </div>
  );
}
