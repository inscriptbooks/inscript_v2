import Image from "next/image";

export default function AboutPage() {
  return (
    <section className="flex w-full max-w-[1440px] flex-col items-start">
      <div className="full-bleed relative aspect-video max-h-[486px] w-full">
        <Image
          src="/images/about-hero.webp"
          alt="about-hero"
          fill
          className="object-cover"
        />
      </div>

      {/* Main content section */}
      <div className="flex flex-col items-start gap-[80px] self-stretch px-[20px] pt-[80px] lg:flex-row lg:gap-[100px] lg:px-[120px] lg:pt-[120px]">
        {/* Logo */}
        <Image
          src="/images/inscript_logo_basic_red-1.webp"
          alt="inscript2025_newlogotype"
          width={160}
          height={36}
          className="relative aspect-[160/35.66]"
        />

        {/* Content columns */}
        <div className="flex min-h-[385px] w-full flex-1 flex-col items-start gap-11 self-stretch lg:flex-row lg:gap-6">
          {/* Left column */}
          <div className="flex flex-1 basis-1/2 flex-col items-start gap-3 self-stretch">
            <h2 className="self-stretch font-serif text-[28px] font-bold leading-[130%] text-primary">
              서점 인스크립트는
            </h2>
            <div className="flex flex-1 flex-col items-start justify-between gap-3 self-stretch">
              <p className="self-stretch font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                서울 대학로 이화사거리에 자리한 희곡 전문 서점으로,말과 글이
                머무르는 곳이라는 문구 아래연극/영화 기반의 서적을 다루고
                소개합니다.희곡 및 연극 영화 관련 서적그리고 예술, 인문, 문학
                등의독립 큐레이션 서적을 만나보실 수 있습니다.서점
                인스크립트에서는매달 새로운 낭독 모임을 열고 있습니다.또한,
                모임과 작은 공연을 위한 공간을 제안합니다.
              </p>
              <p className="font-pretendard text-sm font-normal leading-4 text-gray-3">
                [서점 인스크립트]서울특별시 종로구 율곡로 225 3층
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-1 basis-1/2 flex-col items-start gap-3 self-stretch">
            <h2 className="self-stretch font-serif text-[28px] font-bold leading-[130%] text-primary">
              온라인 인스크립트는
            </h2>
            <div className="flex flex-1 flex-col items-start justify-between gap-3 self-stretch">
              <p className="self-stretch font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                희곡을 중심의 큐레이션 & 커뮤니티 플랫폼입니다.희곡과 작가를
                구축하여 출간 및 미출간 희곡들의 정보와희곡을 짓는 극작가들의
                정보를보다 손쉽게 찾아보실 수 있도록 하였습니다.서점에서 만난
                희곡과 예술 서적을 온라인으로 확장해,독자와 관객, 창작자가 함께
                모이고 교류할 수 있는 무대를 만들어 나갑니다.
              </p>
              <p className="font-pretendard text-sm font-normal leading-4 text-gray-3">
                말과 글이 머무르는 곳
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map section */}
      <div className="mt-10 flex flex-col items-start gap-10 self-stretch px-[20px] pb-[80px] lg:px-[120px] lg:pb-[120px]">
        <div className="flex flex-col gap-5 self-stretch lg:items-end lg:pl-[260px]">
          <div className="flex items-center justify-between self-stretch">
            <h2 className="font-serif text-[28px] font-bold leading-[130%] text-primary">
              오시는 길
            </h2>
          </div>
          <div className="flex h-full w-full flex-col items-center gap-6 self-stretch lg:flex-row">
            <div className="relative aspect-[113/101] w-full lg:basis-1/2">
              <Image
                src="https://api.builder.io/api/v1/image/assets/TEMP/b00123db1c2eca4a9ddf037f79d4c95bba426d26?width=904"
                alt="Map showing location of Inscript bookstore"
                className="object-cover"
                fill
              />
            </div>

            <ul className="flex-1 basis-1/2 list-disc self-stretch pl-[16px] font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
              <li>
                지하철 4호선 혜화역 3번 출구에서 나오셔서 율곡로를 따라 도보 5분
                거리에 인스크립트가 있습니다.
              </li>
              <li>버스 정류장 바로 앞 건물 3층에 위치해 있습니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
