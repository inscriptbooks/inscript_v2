"use client";

import { useState, useEffect } from "react";
import { useLoader } from "@/hooks/common";
import { Button } from "@/components/ui/button";
import IntroductionCard from "./IntroductionCard";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";

interface IntroItem {
    id?: number;
    device: "pc" | "mobile";
    category: "upper" | "lower";
    url: string;
}

export default function IntroductionManagement() {
    const [items, setItems] = useState<IntroItem[]>([
        { device: "pc", category: "upper", url: "" },
        { device: "pc", category: "lower", url: "" },
        { device: "mobile", category: "upper", url: "" },
        { device: "mobile", category: "lower", url: "" },
    ]);

    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        fetchIntroduction();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchIntroduction = async () => {
        showLoader();
        try {
            const response = await fetch("/api/introduction");
            const result = await response.json();
            if (result.data) {
                setItems((prev) =>
                    prev.map((item) => {
                        const found = result.data.find(
                            (d: any) =>
                                d.device === item.device && d.category === item.category
                        );
                        return found ? { ...item, url: found.url, id: found.id } : item;
                    })
                );
            }
        } catch (error) {
            showErrorToast("회사소개 데이터를 불러오지 못했습니다.");
        } finally {
            hideLoader();
        }
    };

    const updateItem = (
        device: "pc" | "mobile",
        category: "upper" | "lower",
        url: string
    ) => {
        setItems((prev) =>
            prev.map((item) =>
                item.device === device && item.category === category
                    ? { ...item, url }
                    : item
            )
        );
    };

    const handleSave = async () => {
        showLoader();
        try {
            const response = await fetch("/api/admin/introduction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items }),
            });

            if (response.ok) {
                showSuccessToast("저장되었습니다.");
            } else {
                showErrorToast("저장에 실패했습니다.");
            }
        } catch (error) {
            showErrorToast("저장하는 중 오류가 발생했습니다.");
        } finally {
            hideLoader();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-10 self-stretch rounded-md bg-white p-11">
            <div className="flex flex-col items-start gap-8 self-stretch">
                <div className="flex items-center justify-between self-stretch">
                    <h2 className="font-pretendard text-xl font-bold text-gray-1">
                        회사소개
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    <span className="font-pretendard text-sm font-normal text-primary">
                        10MB 이하의 파일만 첨부 가능합니다. (권장 사이즈: 1440xN 등 제한된 너비)
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 self-stretch">
                    <IntroductionCard
                        title="PC 화면 가이드 (상단)"
                        imageUrl={
                            items.find(
                                (i) => i.device === "pc" && i.category === "upper"
                            )?.url
                        }
                        onImageChange={(url) => updateItem("pc", "upper", url)}
                    />
                    <IntroductionCard
                        title="모바일 화면 가이드 (상단)"
                        imageUrl={
                            items.find(
                                (i) => i.device === "mobile" && i.category === "upper"
                            )?.url
                        }
                        onImageChange={(url) => updateItem("mobile", "upper", url)}
                    />
                    <IntroductionCard
                        title="PC 화면 가이드 (하단)"
                        imageUrl={
                            items.find(
                                (i) => i.device === "pc" && i.category === "lower"
                            )?.url
                        }
                        onImageChange={(url) => updateItem("pc", "lower", url)}
                    />
                    <IntroductionCard
                        title="모바일 화면 가이드 (하단)"
                        imageUrl={
                            items.find(
                                (i) => i.device === "mobile" && i.category === "lower"
                            )?.url
                        }
                        onImageChange={(url) => updateItem("mobile", "lower", url)}
                    />
                </div>
            </div>

            <div className="flex items-center justify-end self-stretch">
                <Button onClick={handleSave} size="sm" className="h-9 w-12 bg-primary">
                    저장
                </Button>
            </div>
        </div>
    );
}
