import { SubHeader } from "@/components/layout";

export default function CommunityQnaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full flex-1 flex-col pb-[60px]">
      <SubHeader activeTab="qna" />
      {children}
    </section>
  );
}
