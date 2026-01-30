"use client";

import { useState, useEffect } from "react";
import { useLoader } from "@/hooks/common";
import { Button } from "@/components/ui/button";
import PopupCard from "./PopupCard";
import { Popup } from "../types";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import Hamburger from "@/components/icons/Hamburger";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CloseMethodSelector from "./CloseMethodSelector";

export default function PopupManagement() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [closeMethod, setCloseMethod] = useState<"today" | "days" | "never">(
    "today"
  );
  const [closeDays, setCloseDays] = useState<number>(1);
  const { showLoader, hideLoader } = useLoader();
  const router = useRouter();

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    showLoader();
    try {
      const response = await fetch(`/api/admin/popups?all=true`);
      const result = await response.json();
      if (result.data) {
        // DB에서 불러온 데이터에 title 추가
        const popupsWithTitle = result.data.map(
          (popup: Popup, index: number) => ({
            ...popup,
            title: `팝업 ${index + 1}`,
          })
        );
        setPopups(popupsWithTitle);
      }
    } catch (error) {
      // Error silently handled
    } finally {
      hideLoader();
    }
  };
  const handleCancel = () => {
    router.push("/admin/settings/popups");
  };

  const handleAddPopup = () => {
    const tempId = `temp-${Date.now()}`;
    const newPopup: Popup = {
      id: tempId as any,
      title: `팝업 ${popups.length + 1}`,
      detail_image_url: null,
      link_url: "https://",
      is_visible: false,
      start_date: null,
      end_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: "waiting",
      close_method: closeMethod,
      close_days: closeMethod === "days" ? closeDays : null,
    };
    setPopups((prev) => [...prev, newPopup]);
  };

  const handleCloseMethodChange = (
    method: "today" | "days" | "never",
    days?: number
  ) => {
    setCloseMethod(method);
    if (method === "days" && days) {
      setCloseDays(days);
    }
  };

  const handleDeletePopup = async (id: number | string) => {
    if (String(id).startsWith("temp-")) {
      setPopups((prev) => prev.filter((popup) => popup.id !== id));
      return;
    }
    try {
      const response = await fetch(`/api/admin/popups/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPopups((prev) => prev.filter((popup) => popup.id !== id));
        showSuccessToast("팝업이 삭제되었습니다.");
      }
    } catch (error) {
      showErrorToast("팝업 삭제에 실패했습니다.");
    }
  };

  const updatePopup = (id: number | string, updates: Partial<Popup>) => {
    setPopups((prev) =>
      prev.map((popup) => (popup.id === id ? { ...popup, ...updates } : popup))
    );
  };

  const handleSave = async () => {
    showLoader();
    try {
      const promises: Promise<void>[] = [];
      popups.forEach((popup) => {
        if (String(popup.id).startsWith("temp-")) {
          // 새 팝업: POST
          const { id, status, title, ...payload } = popup;
          const payloadWithCloseMethod = {
            ...payload,
            close_method: closeMethod,
            close_days: closeMethod === "days" ? closeDays : null,
          };
          const p = fetch("/api/admin/popups", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadWithCloseMethod),
          })
            .then((res) => res.json())
            .then((result) => {
              if (result.data) {
                setPopups((prev) =>
                  prev.map((p) =>
                    p.id === popup.id
                      ? { ...result.data, title: p.title, status: "waiting" }
                      : p
                  )
                );
              }
            })
            .catch((e) => {
              // Error silently handled
            });
          promises.push(p);
        } else {
          // 기존 팝업: PATCH
          const { status, title, ...payload } = popup;
          const payloadWithCloseMethod = {
            ...payload,
            close_method: closeMethod,
            close_days: closeMethod === "days" ? closeDays : null,
          };
          const p = fetch(`/api/admin/popups/${popup.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadWithCloseMethod),
          })
            .then((res) => res.json())
            .then((result) => {
              if (result.data) {
                setPopups((prev) =>
                  prev.map((p) =>
                    p.id === popup.id
                      ? { ...result.data, title: p.title, status: p.status }
                      : p
                  )
                );
              }
            })
            .catch((e) => {
              // Error silently handled
            });
          promises.push(p);
        }
      });
      await Promise.all(promises);
      showSuccessToast("저장되었습니다.");
    } catch (error) {
      showErrorToast("저장에 실패했습니다.");
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-10 self-stretch rounded-md bg-white p-11 w-full">
      <div className="flex flex-col items-start gap-8 self-stretch">
        <div className="flex items-center justify-between self-stretch">
          <h2 className="font-pretendard text-xl font-bold text-gray-1">
            팝업 관리
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={handleAddPopup}
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
              팝업 추가
            </span>
          </Button>
          <span className="font-pretendard text-sm font-normal text-primary">
            10MB 이하의 파일만 첨부 가능합니다.
          </span>
        </div>

        <div
          className="grid grid-cols-3 gap-4 self-stretch"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(3, minmax(0, 1fr))`,
          }}
        >
          {popups.map((popup) => (
            <PopupCard
              key={popup.id}
              title={popup.title}
              imageUrl={popup.detail_image_url || undefined}
              linkUrl={popup.link_url || ""}
              startDate={popup.start_date || ""}
              endDate={popup.end_date || ""}
              isPublished={popup.is_visible}
              onDelete={() => handleDeletePopup(popup.id)}
              onImageChange={(url: string) =>
                updatePopup(popup.id, { detail_image_url: url })
              }
              onLinkUrlChange={(url: string) =>
                updatePopup(popup.id, { link_url: url })
              }
              onStartDateChange={(date: string) =>
                updatePopup(popup.id, { start_date: date })
              }
              onEndDateChange={(date: string) =>
                updatePopup(popup.id, { end_date: date })
              }
              onPublishToggle={(published: boolean) =>
                updatePopup(popup.id, { is_visible: published })
              }
            />
          ))}
        </div>
      </div>

      {/* 창닫기 방법 */}
      <div className="w-full">
        <CloseMethodSelector
          value={closeMethod}
          days={closeDays}
          onValueChange={handleCloseMethodChange}
        />
      </div>

      <div className="flex items-center justify-between self-stretch gap-2">
        <div>
          <Button
            onClick={handleCancel}
            size="sm"
            className="flex h-9 w-[94px] items-center justify-center gap-1.5 rounded border border-gray-4 bg-white hover:bg-gray-6"
          >
            <Hamburger size={16} color="#555555" />
            <span className="font-pretendard text-sm font-bold text-gray-2">
              목록으로
            </span>
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCancel}
            size="sm"
            className="h-9 w-12 bg-white border border-primary text-primary"
          >
            취소
          </Button>
          <Button
            onClick={handleSave}
            size="sm"
            className="h-9 w-12 bg-primary"
          >
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}
