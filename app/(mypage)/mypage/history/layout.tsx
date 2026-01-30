import { MypageNavSubBar } from "@/components/features/mypage";

interface MyPageHistoryLayoutProps {
  children: React.ReactNode;
}

export default function MyPageHistoryLayout({
  children,
}: MyPageHistoryLayoutProps) {
  return (
    <section className="flex w-full flex-col items-center">
      <MypageNavSubBar />
      {children}
    </section>
  );
}
