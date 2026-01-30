import { SubHeader } from "@/components/layout";

export default function CommunityMarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full flex-1 flex-col pb-[60px]">
      <SubHeader activeTab="market" />
      {children}
    </section>
  );
}
