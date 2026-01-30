"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import CustomRadio from "@/components/ui/CustomRadio";
import Search from "@/components/icons/Search";
import Close from "@/components/icons/Close";
import PlayFormInput from "./PlayFormInput";
import WriterSelectionModal from "./WriterSelectionModal";
import { useCreatePlay, useUpdatePlay } from "@/hooks/plays";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import { PublicStatus, Play } from "@/models/play";

interface PlayFormData {
  title: string;
  writer: string;
  dialogue1: string;
  dialogue2: string;
  dialogue3: string;
  year: string;
  country: string;
  keyword: string;
  plot: string;
  femaleCount: string;
  maleCount: string;
  characterName: string;
  publishHistory: string;
  // 판매 관련
  price?: string;
}

interface PlayEditFormProps {
  initialData?: Play | null;
}

export default function PlayEditForm({ initialData }: PlayEditFormProps) {
  const router = useRouter();
  const createPlay = useCreatePlay();
  const updatePlay = useUpdatePlay();

  const isEditMode = !!initialData;
  const [isHydrated, setIsHydrated] = useState(false);

  const [visibility, setVisibility] = useState("노출");
  const [publishStatus, setPublishStatus] = useState<PublicStatus | null>(
    PublicStatus.PUBLISHED
  );
  // 판매 관련 상태
  const [salesStatus, setSalesStatus] = useState<"판매함" | "판매 안 함">(
    "판매 안 함"
  );
  const [keywords, setKeywords] = useState<string[]>([]);
  const [characters, setCharacters] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [newCharacter, setNewCharacter] = useState("");
  const [isWriterModalOpen, setIsWriterModalOpen] = useState(false);
  const [selectedWriter, setSelectedWriter] = useState("");
  const [selectedWriterId, setSelectedWriterId] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const form = useForm<PlayFormData>({
    defaultValues: {
      title: "",
      writer: "",
      dialogue1: "",
      dialogue2: "",
      dialogue3: "",
      year: "",
      country: "",
      keyword: "",
      plot: "",
      femaleCount: "",
      maleCount: "",
      characterName: "",
      publishHistory: "",
      price: "",
    },
  });

  // 가격 표시용 콤마 포맷팅 값
  const priceWatch = form.watch("price") || "";
  const formattedPrice = priceWatch
    ? priceWatch.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : "";

  // Hydration 완료 감지
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 수정 모드일 때 초기 데이터 설정
  useEffect(() => {
    if (initialData && isHydrated) {
      form.setValue("title", initialData.title || "");
      form.setValue("dialogue1", initialData.line1 || "");
      form.setValue("dialogue2", initialData.line2 || "");
      form.setValue("dialogue3", initialData.line3 || "");
      form.setValue("year", initialData.year || "");
      form.setValue("country", initialData.country || "");
      form.setValue("plot", initialData.summary || "");
      form.setValue("femaleCount", initialData.femaleCharacterCount || "");
      form.setValue("maleCount", initialData.maleCharacterCount || "");
      form.setValue("publishHistory", initialData.publicHistory || "");

      if (initialData.author) {
        setSelectedWriter(initialData.author.authorName);
        setSelectedWriterId(initialData.author.id);
        form.setValue("writer", initialData.author.authorName);
      } else {
        setSelectedWriter("작가 미지정");
        setSelectedWriterId("NONE");
        form.setValue("writer", "작가 미지정");
      }

      setKeywords(initialData.keyword || []);
      setCharacters(initialData.characterList || []);
      setPublishStatus(initialData.publicStatus || PublicStatus.PUBLISHED);
      setVisibility(initialData.isVisible ? "노출" : "미노출");

      // 판매 관련 초기값
      setSalesStatus(
        (initialData.salesStatus as "판매함" | "판매 안 함") || "판매 안 함"
      );
      form.setValue(
        "price",
        initialData.price ? String(initialData.price) : ""
      );
    }
  }, [initialData, form, isHydrated]);

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const removeCharacter = (index: number) => {
    setCharacters(characters.filter((_, i) => i !== index));
  };

  const addKeyword = () => {
    const trimmedKeyword = newKeyword.trim();
    if (!trimmedKeyword) {
      return;
    }

    if (trimmedKeyword.length > 5) {
      showErrorToast("키워드는 5글자까지 입력 가능합니다.");
      setNewKeyword("");
      return;
    }

    if (!keywords.includes(trimmedKeyword)) {
      setKeywords([...keywords, trimmedKeyword]);
      setNewKeyword("");
    } else {
      setNewKeyword("");
    }
  };

  const addCharacter = () => {
    if (newCharacter.trim() && !characters.includes(newCharacter.trim())) {
      setCharacters([...characters, newCharacter.trim()]);
      setNewCharacter("");
    }
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleCharacterKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCharacter();
    }
  };

  const onSubmit = async (data: PlayFormData) => {
    try {
      // 필수 필드 검증
      if (!data.title.trim()) {
        showErrorToast("제목을 입력해주세요.");
        return;
      }
      if (!selectedWriterId) {
        showErrorToast("작가를 선택해주세요.");
        return;
      }
      if (keywords.length === 0) {
        showErrorToast("키워드를 최소 1개 이상 입력해주세요.");
        return;
      }
      if (!data.plot.trim()) {
        showErrorToast("줄거리를 입력해주세요.");
        return;
      }

      // 판매 관련 검증
      const isSelling = salesStatus === "판매함";
      if (isSelling) {
        if (!data.price || data.price.trim() === "") {
          showErrorToast("가격을 입력해주세요.");
          return;
        }
        if (!attachmentFile && !initialData?.attachmentName) {
          showErrorToast("파일을 첨부해주세요.");
          return;
        }
      }

      // 판매 관련 업로드 처리
      let attachmentUrl: string | null | undefined = undefined;
      let attachmentName: string | null | undefined = undefined;
      let attachmentPath: string | null | undefined = undefined;

      if (isSelling) {
        if (attachmentFile) {
          const formData = new FormData();
          formData.append("file", attachmentFile);
          const res = await fetch("/api/plays/upload", {
            method: "POST",
            body: formData,
          });
          if (!res.ok) {
            showErrorToast("파일 업로드에 실패했습니다.");
            return;
          }
          const payload = (await res.json()) as {
            url: string;
            path: string;
            name: string;
            attachmentPath: string;
          };
          attachmentUrl = payload.url;
          attachmentName = payload.name;
          attachmentPath = payload.attachmentPath;
        } else if (
          isEditMode &&
          initialData?.attachmentUrl &&
          initialData?.attachmentName
        ) {
          // 기존 첨부 유지
          attachmentUrl = initialData.attachmentUrl;
          attachmentName = initialData.attachmentName;
          attachmentPath = initialData.attachmentPath;
        }
      } else {
        // 판매 안 함이어도 기존 첨부 유지 (토글만 하는 것이므로)
        if (
          isEditMode &&
          initialData?.attachmentUrl &&
          initialData?.attachmentName
        ) {
          attachmentUrl = initialData.attachmentUrl;
          attachmentName = initialData.attachmentName;
          attachmentPath = initialData.attachmentPath;
        }
      }

      const playData = {
        title: data.title,
        author: selectedWriterId,
        line1: data.dialogue1 || undefined,
        line2: data.dialogue2 || undefined,
        line3: data.dialogue3 || undefined,
        year: data.year || undefined,
        country: data.country || undefined,
        keyword: keywords,
        plot: data.plot,
        femaleCharacterCount: data.femaleCount || undefined,
        maleCharacterCount: data.maleCount || undefined,
        characterList: characters.length > 0 ? characters : undefined,
        publicStatus: publishStatus || undefined,
        publicHistory: data.publishHistory || undefined,
        // 판매 관련
        salesStatus,
        // 판매 여부와 관계없이 가격 유지 (토글만 하는 것이므로)
        price: data.price || undefined,
        attachmentUrl,
        attachmentName,
        attachmentPath,
      };

      if (isEditMode && initialData) {
        // 수정 모드
        await updatePlay.mutateAsync({
          id: initialData.id,
          ...playData,
        });
        showSuccessToast("희곡 수정이 완료되었습니다.");
      } else {
        // 등록 모드
        await createPlay.mutateAsync(playData);
        showSuccessToast("희곡 등록이 완료되었습니다.");
      }

      // 1초 후 페이지 이동
      setTimeout(() => {
        router.push("/admin/plays");
      }, 1000);
    } catch (error) {
      showErrorToast(
        isEditMode ? "희곡 수정에 실패했습니다." : "희곡 등록에 실패했습니다."
      );
    }
  };

  return (
    <div className="flex w-full p-8">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-1 flex-col items-center justify-center rounded-[5px] bg-white p-11"
      >
        {/* Header */}
        <div className="flex w-full flex-col items-start gap-4">
          <div className="flex w-full items-center justify-between">
            <h1 className="font-pretendard text-2xl font-semibold leading-8 text-gray-1">
              희곡 {isEditMode ? "수정" : "등록"}
            </h1>
          </div>

          {/* 노출 여부 */}
          <div className="flex w-full items-center">
            <div className="flex h-14 w-40 items-center gap-1">
              <span className="font-pretendard text-xl font-semibold leading-6 text-gray-3">
                노출 여부
              </span>
              <span className="font-pretendard text-xl font-semibold leading-6 text-red">
                *
              </span>
            </div>
            <div className="flex flex-1 items-center">
              <CustomRadio
                value="노출"
                checked={visibility === "노출"}
                onChange={setVisibility}
                label="노출"
                className="p-2"
              />
              <CustomRadio
                value="미노출"
                checked={visibility === "미노출"}
                onChange={setVisibility}
                label="미노출"
                className="p-2"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex w-full items-start justify-between gap-11">
          {/* Left Column */}
          <div className="flex flex-1 flex-col items-start gap-4">
            {/* 제목 */}
            <PlayFormInput
              label="제목"
              required
              placeholder="제목을 입력해주세요"
              className="border-red-3"
              {...form.register("title")}
            />

            {/* 작가 */}
            <div className="flex w-full items-start">
              <div className="flex h-14 w-40 items-start gap-1 py-4">
                <span className="font-pretendard text-xl font-semibold leading-6 text-gray-3">
                  작가
                </span>
                <span className="font-pretendard text-xl font-semibold leading-6 text-red">
                  *
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={selectedWriter}
                    onClick={() => setIsWriterModalOpen(true)}
                    readOnly
                    placeholder="작가 이름을 입력해주세요"
                    className="h-14 w-full cursor-pointer rounded border border-red-3 bg-orange-4 px-5 py-4 font-pretendard text-base leading-6 text-gray-1 placeholder:text-orange-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Search
                    size={24}
                    color="#911A00"
                    className="pointer-events-none absolute right-5"
                  />
                </div>
              </div>
            </div>

            {/* 대사1 */}
            <PlayFormInput
              label="대사1"
              placeholder="이 작품을 대표하는 대사를 찾아 입력해주세요"
              className="border-red-3"
              {...form.register("dialogue1")}
            />

            {/* 대사2 */}
            <PlayFormInput
              label="대사2"
              placeholder="이 작품을 대표하는 대사를 찾아 입력해주세요"
              className="border-red-3"
              {...form.register("dialogue2")}
            />

            {/* 대사3 */}
            <PlayFormInput
              label="대사3"
              placeholder="이 작품을 대표하는 대사를 찾아 입력해주세요"
              className="border-red-3"
              {...form.register("dialogue3")}
            />

            {/* 연도 */}
            <PlayFormInput
              label="연도"
              placeholder="작품이 발표된 연도를 입력해주세요"
              className="border-red-3"
              {...form.register("year")}
            />

            {/* 나라 */}
            <PlayFormInput
              label="나라"
              placeholder="작품이 발표된 나라를 입력해주세요"
              className="border-red-3"
              {...form.register("country")}
            />

            {/* 키워드 */}
            <div className="flex w-full flex-col items-end gap-4">
              <div className="flex w-full items-start">
                <div className="flex h-14 w-40 items-start gap-1 py-4">
                  <span className="font-pretendard text-xl font-semibold leading-6 text-gray-3">
                    키워드
                  </span>
                  <span className="font-pretendard text-xl font-semibold leading-6 text-red">
                    *
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => {
                      const { value } = e.target;
                      if (value.length > 5) {
                        showErrorToast("키워드는 5글자까지 입력 가능합니다.");
                        return;
                      }
                      setNewKeyword(value);
                    }}
                    onKeyPress={handleKeywordKeyPress}
                    placeholder="대표 키워드 입력 후 엔터를 눌러주세요"
                    className="h-14 w-full rounded border border-red-3 bg-orange-4 px-5 py-4 font-pretendard text-base leading-6 text-gray-1 placeholder:text-orange-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex w-full flex-wrap items-center justify-end gap-4">
                {keywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    className="flex h-8 items-center gap-1.5 rounded-2xl bg-red-3 px-3 py-2"
                  >
                    <span className="font-pretendard text-sm leading-4 text-primary">
                      {keyword}
                    </span>
                    <button onClick={() => removeKeyword(index)}>
                      <Close size={16} color="#911A00" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-1 flex-col items-start gap-4">
            {/* 줄거리 */}
            <div className="flex h-[230px] w-full items-start">
              <div className="flex h-14 w-40 items-start gap-1 py-4">
                <span className="font-pretendard text-xl font-semibold leading-6 text-gray-3">
                  줄거리
                </span>
                <span className="font-pretendard text-xl font-semibold leading-6 text-red">
                  *
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <textarea
                  placeholder="작품의 요약 줄거리를 입력해주세요"
                  {...form.register("plot")}
                  className="h-full w-full rounded border border-red-3 bg-orange-4 px-5 py-4 font-pretendard text-base leading-6 text-gray-1 placeholder:text-orange-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* 등장인물 수 */}
            <div className="flex w-full items-center">
              <div className="flex h-14 w-40 items-center gap-1">
                <span className="font-pretendard text-xl font-semibold leading-6 text-gray-3">
                  등장인물 수
                </span>
              </div>
              <div className="flex flex-1 items-center gap-6 pl-2">
                <div className="flex flex-1 items-center gap-3">
                  <span className="font-pretendard text-sm leading-4 text-gray-3">
                    여
                  </span>
                  <input
                    type="text"
                    {...form.register("femaleCount")}
                    className="h-14 flex-1 rounded border border-red-3 bg-orange-4 px-5 py-4 font-pretendard text-base leading-6 text-gray-1 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-1 items-center gap-3">
                  <span className="font-pretendard text-sm leading-4 text-gray-3">
                    남
                  </span>
                  <input
                    type="text"
                    {...form.register("maleCount")}
                    className="h-14 flex-1 rounded border border-red-3 bg-orange-4 px-5 py-4 font-pretendard text-base leading-6 text-gray-1 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* 등장인물 목록 */}
            <div className="flex w-full flex-col items-end gap-4">
              <div className="flex w-full items-start">
                <div className="flex h-14 w-40 items-start gap-1 py-4">
                  <span className="font-pretendard text-xl font-semibold leading-6 text-gray-3">
                    등장인물 목록
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <input
                    type="text"
                    value={newCharacter}
                    onChange={(e) => setNewCharacter(e.target.value)}
                    onKeyPress={handleCharacterKeyPress}
                    placeholder="작품에 등장하는 등장인물 이름 입력 후 엔터를 눌러주세요"
                    className="h-14 w-full rounded border border-red-3 bg-orange-4 px-5 py-4 font-pretendard text-base leading-6 text-gray-1 placeholder:text-orange-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex w-full flex-wrap items-center justify-end gap-4">
                {characters.map((character, index) => (
                  <Badge
                    key={index}
                    className="flex h-8 items-center gap-1.5 rounded-2xl bg-red-3 px-3 py-2"
                  >
                    <span className="font-pretendard text-sm leading-4 text-primary">
                      {character}
                    </span>
                    <button onClick={() => removeCharacter(index)}>
                      <Close size={16} color="#911A00" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* 출간 여부 */}
            <div className="flex w-full items-center">
              <div className="flex h-14 w-40 items-center gap-1">
                <span className="font-pretendard text-xl font-semibold leading-6 text-gray-3">
                  출간 여부
                </span>
              </div>
              <div className="flex flex-1 items-center">
                <CustomRadio
                  value={PublicStatus.PUBLISHED}
                  checked={publishStatus === PublicStatus.PUBLISHED}
                  onChange={(value) => setPublishStatus(value as PublicStatus)}
                  label="출간"
                  className="p-2"
                />
                <CustomRadio
                  value={PublicStatus.UNPUBLISHED}
                  checked={publishStatus === PublicStatus.UNPUBLISHED}
                  onChange={(value) => setPublishStatus(value as PublicStatus)}
                  label="미출간"
                  className="p-2"
                />
                <CustomRadio
                  value={PublicStatus.OUT_OF_PRINT}
                  checked={publishStatus === PublicStatus.OUT_OF_PRINT}
                  onChange={(value) => setPublishStatus(value as PublicStatus)}
                  label="절판"
                  className="p-2"
                />
              </div>
            </div>

            {/* 출간 내역 */}
            <div className="flex w-full items-start">
              <div className="flex h-14 w-40 items-start gap-1 py-4">
                <span className="font-pretendard text-xl font-semibold leading-6 text-gray-3">
                  출간 내역
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <input
                  type="text"
                  placeholder="출간 내역이 있는 경우 입력해주세요"
                  {...form.register("publishHistory")}
                  className="h-14 w-full rounded border border-red-3 bg-orange-4 px-5 py-4 font-pretendard text-base leading-6 text-gray-1 placeholder:text-orange-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* 판매 여부 */}
            <div className="flex w-full items-center">
              <div className="flex h-14 w-40 items-center gap-1">
                <span className="font-pretendard text-xl font-semibold leading-6 text-gray-3">
                  판매 여부
                </span>
                <span className="font-pretendard text-xl font-semibold leading-6 text-red">
                  *
                </span>
              </div>
              <div className="flex flex-1 items-center">
                <CustomRadio
                  value="판매함"
                  checked={salesStatus === "판매함"}
                  onChange={(value) =>
                    setSalesStatus(value as "판매함" | "판매 안 함")
                  }
                  label="판매함"
                  className="p-2"
                />
                <CustomRadio
                  value="판매 안 함"
                  checked={salesStatus === "판매 안 함"}
                  onChange={(value) =>
                    setSalesStatus(value as "판매함" | "판매 안 함")
                  }
                  label="판매 안 함"
                  className="p-2"
                />
              </div>
            </div>

            {/* 가격 (판매함일 때 노출) */}
            {salesStatus === "판매함" && (
              <>
                {/* 가격 입력: 콤마 표기, 내부 값은 숫자만 저장 */}
                <PlayFormInput
                  label="가격"
                  required
                  placeholder="가격을 입력해주세요"
                  value={formattedPrice}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/[^0-9]/g, "");
                    form.setValue("price", digitsOnly, {
                      shouldValidate: true,
                    });
                  }}
                />

                {/* 파일 첨부 (판매함일 때 필수) */}
                <div className="flex w-full items-start">
                  <div className="flex h-14 w-40 items-start gap-1 py-4">
                    <span className="font-pretendard text-xl font-semibold leading-6 text-gray-3">
                      파일 첨부하기
                    </span>
                    <span className="font-pretendard text-xl font-semibold leading-6 text-red">
                      *
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        if (f && f.size > 10 * 1024 * 1024) {
                          showErrorToast("10MB 이하의 파일만 첨부 가능합니다.");
                          e.currentTarget.value = "";
                          setAttachmentFile(null);
                          return;
                        }
                        setAttachmentFile(f);
                      }}
                      className="h-14 w-full rounded border border-red-3 bg-orange-4 px-5 py-4 font-pretendard text-base leading-6 text-gray-1 placeholder:text-orange-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-sm text-gray-3">
                      {attachmentFile?.name ||
                        initialData?.attachmentName ||
                        "PDF 파일을 업로드 해주세요"}
                    </p>
                    <p className="text-sm text-primary">
                      10MB 이하의 파일만 첨부 가능합니다.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex w-full items-center justify-end">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => router.push("/admin/plays")}
              className="flex h-9 w-12 items-center justify-center gap-1.5 rounded border border-primary bg-white"
            >
              <span className="font-pretendard text-sm font-semibold leading-4 text-primary">
                취소
              </span>
            </button>
            <button
              type="submit"
              disabled={createPlay.isPending || updatePlay.isPending}
              className="flex h-9 w-12 items-center justify-center gap-1.5 rounded bg-primary disabled:opacity-50"
            >
              <span className="font-pretendard text-sm font-semibold leading-4 text-white">
                {createPlay.isPending || updatePlay.isPending
                  ? "저장 중"
                  : "저장"}
              </span>
            </button>
          </div>
        </div>
      </form>

      {/* 작가 선택 모달 */}
      <WriterSelectionModal
        isOpen={isWriterModalOpen}
        onClose={() => setIsWriterModalOpen(false)}
        onSelect={(writer) => {
          if (writer.id === "NONE") {
            setSelectedWriter("작가 미지정");
            setSelectedWriterId("NONE");
            form.setValue("writer", "작가 미지정");
          } else {
            setSelectedWriter(writer.name);
            setSelectedWriterId(writer.id);
            form.setValue("writer", writer.name);
          }
        }}
      />
    </div>
  );
}
