import { createClient } from "@/lib/supabase/server";
import { MembershipContainer } from "./components/MembershipContainer";
import { redirect } from "next/navigation";

export default async function MypageMembershipSection() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("name, membership, created_at")
    .eq("id", user.id)
    .single();

  if (!userData) {
    return (
      <section className="flex w-full flex-col items-center justify-center gap-[40px]">
        <p>사용자 정보를 불러올 수 없습니다.</p>
      </section>
    );
  }

  return (
    <MembershipContainer
      initialData={{
        name: userData.name,
        membership: userData.membership || false,
        membershipStartDate: userData.membership ? userData.created_at : null,
      }}
    />
  );
}
