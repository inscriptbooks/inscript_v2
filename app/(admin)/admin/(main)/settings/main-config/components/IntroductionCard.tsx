"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { showErrorToast } from "@/components/ui/toast";

interface IntroductionCardProps {
    title: string;
    imageUrl?: string;
    onImageChange?: (url: string) => void;
    className?: string;
}

export default function IntroductionCard({
    title,
    imageUrl,
    onImageChange,
    className,
}: IntroductionCardProps) {
    const [localImageUrl, setLocalImageUrl] = useState(imageUrl);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            showErrorToast("10MB 이하의 파일만 업로드 가능합니다.");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            // Using the same upload endpoint as banners for image upload
            const response = await fetch("/api/banners/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (result.url) {
                setLocalImageUrl(result.url);
                onImageChange?.(result.url);
            }
        } catch (error) {
            showErrorToast("이미지 업로드에 실패했습니다.");
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        setLocalImageUrl(imageUrl);
    }, [imageUrl]);

    return (
        <div
            className={cn(
                "flex w-full flex-col gap-4 rounded bg-[#FAF8F6] p-8",
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-pretendard text-xl font-bold text-gray-1">
                    {title}
                </h3>
            </div>

            {/* Image Area */}
            <div className="relative">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />
                {localImageUrl ? (
                    <div
                        className="h-[500px] w-full rounded bg-cover bg-center"
                        style={{ backgroundImage: `url(${localImageUrl})` }}
                    >
                        <button
                            type="button"
                            onClick={handleImageClick}
                            disabled={uploading}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-sm bg-[#F4EFEA] disabled:opacity-50"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path
                                    d="M11.9283 4.91352L13.9511 2.89066C14.1464 2.6954 14.463 2.6954 14.6582 2.89066L16.7236 4.95603C16.9189 5.15129 16.9189 5.46788 16.7236 5.66314L14.7008 7.68599M11.9283 4.91352L4.17385 12.6679C4.06407 12.7777 3.98136 12.9115 3.93227 13.0588L2.93691 16.0449C2.80662 16.4358 3.17849 16.8077 3.56937 16.6774L6.55544 15.682C6.70272 15.6329 6.83655 15.5502 6.94632 15.4404L14.7008 7.68599M11.9283 4.91352L14.7008 7.68599"
                                    stroke="#911A00"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={handleImageClick}
                        disabled={uploading}
                        className="flex h-[200px] w-full flex-col items-center justify-center rounded border border-dashed border-gray-4 bg-gray-6 disabled:opacity-50 hover:bg-gray-200"
                    >
                        {uploading ? (
                            <span className="font-pretendard text-lg font-bold text-gray-4">
                                업로드 중...
                            </span>
                        ) : (
                            <>
                                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                                    <path
                                        d="M12.5008 38.5L21.4654 28.5354C22.403 27.598 23.6746 27.0714 25.0004 27.0714C26.3262 27.0714 27.5977 27.598 28.5354 28.5354L40.0004 40.0004M35.0004 35.0004L38.9654 31.0354C39.903 30.098 41.1746 29.5714 42.5004 29.5714C43.8262 29.5714 45.0977 30.098 46.0354 31.0354L48.001 34.5M35.0004 20.0004H35.0254M48.5359 48.5359V11.4648H11.4648V48.5359H48.5359Z"
                                        stroke="#A0A0A0"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span className="mt-2 font-pretendard text-lg font-bold text-gray-4">
                                    업로드하기
                                </span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
