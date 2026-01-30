"use client";

import { Play } from "@/models/play";
import { Badge } from "@/components/ui/badge";
import { PublicStatusLabel } from "@/models/play";
import PlayPurchasePreviewButtons from "../components/PlayPurchasePreviewButtons";

interface PlayDetailSectionProps {
  play: Play;
}

export default function PlayDetailSection({ play }: PlayDetailSectionProps) {
  return (
    <section className="flex w-full flex-col pb-10">
      <div className="flex justify-center px-[20px] lg:px-[120px]">
        <div className="flex w-full flex-col gap-5 lg:flex-row lg:justify-between">
          <div className="flex flex-col gap-2.5 lg:basis-[58%]">
            <h2 className="text-lg font-semibold leading-[20px] text-gray-1 lg:text-[20px]">
              대사
            </h2>

            <p className="whitespace-pre-line font-serif text-2xl font-bold leading-[32px] text-primary lg:text-[32px] lg:leading-[44px]">
              {play.line1}
            </p>
            <p className="whitespace-pre-line font-serif text-2xl font-bold leading-[32px] text-red-1 lg:text-[32px] lg:leading-[44px]">
              {play.line2}
            </p>
            <p className="whitespace-pre-line font-serif text-2xl font-bold leading-[32px] text-red-1 lg:text-[32px] lg:leading-[44px]">
              {play.line3}
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-10">
            <div className="flex justify-between">
              {play.year && (
                <div className="flex basis-1/2 flex-col gap-2.5">
                  <h2 className="text-lg font-semibold text-gray-1 lg:text-[20px]">
                    연도
                  </h2>
                  <span className="text-gray-2">{play.year}</span>
                </div>
              )}
              {play.country && (
                <div className="flex basis-1/2 flex-col gap-2.5">
                  <h2 className="text-lg font-semibold text-gray-1 lg:text-[20px]">
                    나라
                  </h2>
                  <span className="text-gray-2">{play.country}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2.5">
              <h2 className="text-lg font-semibold text-gray-1 lg:text-[20px]">
                키워드
              </h2>
              <div className="flex flex-wrap gap-2">
                {play.keyword.map((keyword) => (
                  <Badge
                    key={keyword}
                    size="md"
                    variant="light"
                    className="rounded-full"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <h2 className="text-lg font-semibold text-gray-1 lg:text-[20px]">
                줄거리
              </h2>
              <p className="whitespace-pre-line leading-[24px] text-gray-2">
                {play.summary}
              </p>
            </div>

            <div className="flex justify-between">
              {(() => {
                const female = Number(play.femaleCharacterCount ?? 0);
                const male = Number(play.maleCharacterCount ?? 0);

                if (female === 0 && male === 0) return null;

                let countText = "";
                if (female > 0 && male === 0) countText = `여 ${female}`;
                else if (female === 0 && male > 0) countText = `남 ${male}`;
                else countText = `여 ${female} / 남 ${male}`;

                return (
                  <div className="flex basis-1/2 flex-col gap-2.5">
                    <h2 className="text-lg font-semibold text-gray-1 lg:text-[20px]">
                      등장인물 수
                    </h2>
                    <span className="text-gray-2">{countText}</span>
                  </div>
                );
              })()}
              {play.characterList && play.characterList.length > 0 && (
                <div className="flex basis-1/2 flex-col gap-2.5">
                  <h2 className="text-lg font-semibold text-gray-1 lg:text-[20px]">
                    등장인물
                  </h2>
                  <p className="break-keep text-gray-2">
                    {play.characterList.join(", ")}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2.5">
              <h2 className="text-lg font-semibold text-gray-1 lg:text-[20px]">
                출간
              </h2>
              <p className="whitespace-pre-line leading-[24px] text-gray-2">
                {play.publicStatus ? PublicStatusLabel[play.publicStatus] : "-"}
              </p>
            </div>

            {play.publicHistory && (
              <div className="flex flex-col gap-2.5">
                <h2 className="text-lg font-semibold text-gray-1 lg:text-[20px]">
                  출간내역
                </h2>
                <p className="whitespace-pre-line leading-[24px] text-gray-2">
                  {play.publicHistory}
                </p>
              </div>
            )}

            {/* 판매 정보 */}
            <div className="flex flex-col gap-2.5">
              <h2 className="text-lg font-semibold text-gray-1 lg:text-[20px]">
                판매
              </h2>
              <div className="leading-[24px] text-gray-2">
                {play.salesStatus === "판매함" ? (
                  <div className="flex flex-col gap-10">
                    <span>
                      가격:{" "}
                      {typeof play.price === "number"
                        ? `${play.price.toLocaleString()}원`
                        : "-"}
                    </span>
                    <PlayPurchasePreviewButtons
                      playId={play.id}
                      playTitle={play.title}
                      authorName={play.author?.authorName ?? "작가 미지정"}
                      price={play.price}
                      attachmentUrl={play.attachmentUrl}
                      attachmentName={play.attachmentName}
                      attachmentPath={play.attachmentPath}
                    />
                  </div>
                ) : (
                  <span>판매 안 함</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
