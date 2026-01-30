import { AuthorRequestForm } from "@/components/forms";
import { createClient } from "@/lib/supabase/server";
import AuthorApplicationStatus from "./components/AuthorApplicationStatus";

export default async function MyPageAuthorApply() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let applicationStatus = null;

  if (user) {
    const { data: application } = await supabase
      .from("author_applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (application) {
      applicationStatus = application.status;
    }
  }

  return (
    <section className="flex w-full flex-1 flex-col items-center">
      {applicationStatus ? (
        <AuthorApplicationStatus status={applicationStatus} />
      ) : (
        <AuthorRequestForm />
      )}
    </section>
  );
}
