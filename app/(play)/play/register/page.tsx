import { PlayRegisterForm } from "@/components/forms";

export default function PlayRegisterPage() {
  return (
    <section className="flex w-full flex-1 flex-col pb-[60px] pt-11 lg:pt-[80px]">
      <div className="flex flex-col gap-3 px-[20px] pb-5 lg:px-[120px]">
        <h1 className="font-serif text-xl font-bold text-primary lg:text-[28px]">
          희곡 등록하기
        </h1>
        <p className="text-gray-1 lg:text-xl">
          인스크립트 희곡에 등록되지 않은 새로운 작품을 올려주세요. 검토 후 DB에
          저장됩니다.
        </p>
      </div>
      <div className="full-bleed border-b border-primary" />

      <div className="flex justify-center px-[20px] pt-5 lg:px-[120px] lg:pt-11">
        <PlayRegisterForm />
      </div>
    </section>
  );
}
