"use client";

import { AuthorRequestForm } from "@/components/forms";
import AuthorApplicationStatus from "./components/AuthorApplicationStatus";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function MyPageAuthorApply() {
  const [applicationStatus, setApplicationStatus] = useState<
    "pending" | "approved" | "rejected" | null
  >(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: application } = await supabase
          .from("author_applications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (application) {
          setApplicationStatus(application.status);
          setRejectionReason(application.rejection_reason);
        }
      }
      setIsLoading(false);
    };

    fetchApplicationStatus();
  }, []);

  const handleReapply = () => {
    setShowForm(true);
  };

  const handleSubmitSuccess = async () => {
    setShowForm(false);
    setIsLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: application } = await supabase
        .from("author_applications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (application) {
        setApplicationStatus(application.status);
        setRejectionReason(application.rejection_reason);
      }
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <section className="flex w-full flex-1 flex-col items-center justify-center">
        <div className="text-gray-3">로딩 중...</div>
      </section>
    );
  }

  return (
    <section className="flex w-full flex-1 flex-col items-center">
      {applicationStatus && !showForm ? (
        <AuthorApplicationStatus
          status={applicationStatus}
          rejectionReason={rejectionReason}
          onReapply={handleReapply}
        />
      ) : (
        <AuthorRequestForm onSubmit={handleSubmitSuccess} />
      )}
    </section>
  );
}
