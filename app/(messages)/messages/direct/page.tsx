import { DirectMessageListSection } from "@/components/features/message";

export default function DirectMessagePage() {
  return (
    <section className="flex w-full flex-col items-center gap-8 pb-[60px]">
      <div className="flex w-full justify-center border-b border-b-primary pb-5 pt-11 lg:pt-20">
        <h1 className="font-serif text-xl font-bold text-primary lg:text-[28px]">
          쪽지
        </h1>
      </div>

      <DirectMessageListSection />
    </section>
  );
}
