import { Badge } from "@/components/ui/badge";
import { PlayData } from "../types";

interface PlayInfoProps {
  playData: PlayData;
}

export default function PlayInfo({ playData }: PlayInfoProps) {
  // 출간 상태 한글 변환
  const getPublicationStatusText = (status: string | null) => {
    if (!status) return "미출간";
    switch (status) {
      case "published":
        return "출판";
      case "unpublished":
        return "미출간";
      case "outOfPrint":
        return "절판";
      default:
        return "미출간";
    }
  };

  // 노출 여부 한글 변환
  const getExposureStatusText = (isVisible: boolean) => {
    return isVisible ? "노출중" : "비노출";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold leading-6 text-gray-1">작품정보</h2>
      </div>

      <div className="flex flex-col border border-gray-7">
        {/* 제목 */}
        <div className="flex items-stretch border-b border-gray-7">
          <div className="flex flex-1">
            <div className="flex w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-2">
                제목
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-1">
                {playData.title}
              </span>
            </div>
          </div>
        </div>

        {/* 작가 */}
        <div className="flex items-stretch border-b border-gray-7">
          <div className="flex flex-1">
            <div className="flex w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-2">
                작가 (한글/영문)
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-1">
                {playData.author
                  ? `${playData.author.author_name}${playData.author.author_name_en ? `/${playData.author.author_name_en}` : ""}`
                  : "작가 정보 없음"}
              </span>
            </div>
          </div>
        </div>

        {/* 출간여부 & 출간내역 */}
        <div className="flex items-stretch border-b border-gray-7">
          <div className="flex flex-1">
            <div className="flex w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-2">
                출간 여부
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-2">
                {getPublicationStatusText(playData.public_status)}
              </span>
            </div>
          </div>
          <div className="flex flex-1">
            <div className="flex w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-2">
                출간 내역
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-2">
                {playData.public_history || "출간내역 없음"}
              </span>
            </div>
          </div>
        </div>

        {/* 판매 정보 */}
        <div className="flex items-stretch border-b border-gray-7">
          <div className="flex flex-1">
            <div className="flex w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-2">
                판매 여부
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-2">
                {playData.sales_status || "판매 안 함"}
              </span>
            </div>
          </div>
          <div className="flex flex-1">
            <div className="flex w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-2">
                판매 정보
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
              {playData.sales_status === "판매함" ? (
                <div className="flex flex-col gap-1">
                  <span className="text-base font-normal leading-6 text-gray-2">
                    가격:{" "}
                    {typeof playData.price === "number"
                      ? `${playData.price.toLocaleString()}원`
                      : "-"}
                  </span>
                  {playData.attachment_url && playData.attachment_name ? (
                    <div className="flex items-center gap-2">
                      <span className="text-base font-normal leading-6 text-gray-2">
                        첨부파일:
                      </span>
                      <a
                        href={`${playData.attachment_url}?download=${encodeURIComponent(
                          playData.attachment_name
                        )}`}
                        className="text-primary underline"
                      >
                        {playData.attachment_name}
                      </a>
                    </div>
                  ) : (
                    <span className="text-base font-normal leading-6 text-gray-2">
                      첨부파일: -
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-base font-normal leading-6 text-gray-2">
                  판매내역 없음
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 키워드 */}
        <div className="flex items-stretch border-b border-gray-7">
          <div className="flex min-h-12 flex-1">
            <div className="flex w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-2">
                키워드
              </span>
            </div>
            <div className="flex flex-1 items-center gap-1.5 px-6 py-2.5">
              {playData.keyword && playData.keyword.length > 0 ? (
                playData.keyword.map((keyword: string, index: number) => (
                  <Badge
                    key={index}
                    className="flex h-8 items-center justify-center gap-2.5 rounded border border-primary bg-white px-2.5 py-2 text-sm font-medium text-primary"
                  >
                    {keyword}
                  </Badge>
                ))
              ) : (
                <span className="text-base font-normal leading-6 text-gray-2">
                  키워드 없음
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 대표대사 */}
        <div className="flex items-stretch border-b border-gray-7">
          <div className="flex flex-1">
            <div className="flex w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-2">
                대표대사
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
              <span className="whitespace-pre-line text-base font-normal leading-6 text-gray-1">
                {playData.line1 ||
                  playData.line2 ||
                  playData.line3 ||
                  "대표대사 없음"}
              </span>
            </div>
          </div>
        </div>

        {/* 줄거리 */}
        <div className="flex items-stretch border-b border-gray-7">
          <div className="flex flex-1">
            <div className="flex w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-2">
                줄거리
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
              <span className="whitespace-pre-line text-base font-normal leading-6 text-gray-1">
                {playData.summary}
              </span>
            </div>
          </div>
        </div>

        {/* 노출 여부 */}
        <div className="flex items-stretch border-b border-gray-7">
          <div className="flex flex-1">
            <div className="flex w-40 items-center gap-2.5 bg-gray-7 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-2">
                노출 여부
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-6 py-2.5">
              <span className="text-base font-normal leading-6 text-gray-1">
                {getExposureStatusText(playData.is_visible)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
