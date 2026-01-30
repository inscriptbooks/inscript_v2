import { SubHeader } from "@/components/layout";

export default function CommunityPromotionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full flex-1 flex-col pb-[60px]">
      <SubHeader activeTab="promotion" />
      {children}
    </section>
  );
}
