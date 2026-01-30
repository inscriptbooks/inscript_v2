import { ReactNode } from "react";

interface ProgramDetailLayoutProps {
  children: ReactNode;
}

export default async function ProgramDetailLayout({
  children,
}: ProgramDetailLayoutProps) {
  return (
    <section className="flex w-full flex-1 flex-col pb-[60px] pt-11 lg:pt-[80px]">
      {children}
    </section>
  );
}
