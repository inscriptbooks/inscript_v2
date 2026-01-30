import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users";
import { eq } from "drizzle-orm";
import ProfilePageClient from "./components/ProfilePageClient";

export default async function MyPageProfile() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth");
  }

  // users 테이블에서 사용자 정보 가져오기
  const userData = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  });

  if (!userData) {
    redirect("/auth");
  }

  return (
    <section className="flex w-full flex-1 flex-col items-center">
      <ProfilePageClient initialName={userData.name || ""} />
    </section>
  );
}
