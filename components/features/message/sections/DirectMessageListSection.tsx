import { MessageList } from "@/components/features/message";

export default function DirectMessageListSection() {
  return (
    <section className="flex w-full max-w-[794px] flex-col items-center gap-5 px-[20px] lg:px-[120px]">
      <MessageList />
    </section>
  );
}
