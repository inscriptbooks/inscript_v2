import PlayEditForm from "./components/PlayEditForm";
import { Play } from "@/models/play";

interface PageProps {
  searchParams: Promise<{ play_id?: string }>;
}

async function getPlayData(playId: string): Promise<Play | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/plays/${playId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    return null;
  }
}

export default async function PlayEditPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const playId = params.play_id;

  let initialData: Play | null = null;

  if (playId) {
    initialData = await getPlayData(playId);
  }

  return <PlayEditForm initialData={initialData} />;
}
