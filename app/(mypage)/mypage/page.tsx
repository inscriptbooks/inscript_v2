import { AccountManagementForm } from "@/components/forms";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users";
import { eq } from "drizzle-orm";

export default async function MyPage() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect("/auth");
  }

  // DB에서 사용자 정보 조회
  const [userInfo] = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  const isLocalUser = userInfo?.authProvider === "local";

  return (
    <section className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center gap-[60px] px-[20px] pb-[60px] lg:px-[120px]">
      <AccountManagementForm 
        defaultValues={{ userId: user.email || "" }}
        isLocalUser={isLocalUser}
      />
    </section>
  );
}
