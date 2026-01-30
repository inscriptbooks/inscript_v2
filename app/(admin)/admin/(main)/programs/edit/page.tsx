import ProgramEditWrapper from "./components/ProgramEditWrapper";

interface PageProps {
  searchParams: Promise<{ program_id?: string }>;
}

export default async function ProgramEditPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const programId = params.program_id;

  let initialData = undefined;

  if (programId) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/programs/${programId}`,
        {
          cache: "no-store",
        }
      );

      if (response.ok) {
        initialData = await response.json();
      }
    } catch (error) {
      // 에러 발생 시 초기값 없이 진행
    }
  }

  return <ProgramEditWrapper initialData={initialData} />;
}
