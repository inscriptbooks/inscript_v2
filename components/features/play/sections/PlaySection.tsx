import { PlayViewToggle } from "../components";
import { PlayAlbumListSection, PlayTextListSection } from "../sections";

interface PlaySectionProps {
  view?: string;
  consonant?: string;
  keyword?: string;
}

export default function PlaySection({
  view,
  consonant,
  keyword,
}: PlaySectionProps) {
  return (
    <section className="flex w-full flex-1 flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="font-serif text-xl font-bold text-primary lg:text-[28px]">
          희곡
        </span>
        <div className="flex items-center gap-5">
          <span className="text-lg font-semibold text-orange-2">보기 방식</span>
          <PlayViewToggle view={view} />
        </div>
      </div>

      {view === "text" ? (
        <PlayTextListSection initialConsonant={consonant} keyword={keyword} />
      ) : (
        <>
          <p className="self-end text-center font-pretendard text-sm font-normal leading-5 tracking-[-0.28px] text-gray-1">
            <span className="font-bold text-primary">장바구니 아이콘</span>이
            표시되어 있는 희곡은 구매가 가능합니다.
          </p>
          <PlayAlbumListSection keyword={keyword} />
        </>
      )}
    </section>
  );
}
