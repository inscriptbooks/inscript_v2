"use client";

import { ProfileForm } from "@/components/forms";
import NameChangeSuccessModal from "@/components/common/Modal/NameChangeSuccessModal";
import { useState } from "react";

interface ProfilePageClientProps {
  initialName: string;
}

export default function ProfilePageClient({ initialName }: ProfilePageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // 페이지 새로고침하여 최신 데이터 반영
    window.location.reload();
  };

  return (
    <>
      <ProfileForm
        defaultValues={{ name: initialName }}
        onSuccess={handleSuccess}
      />
      <NameChangeSuccessModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </>
  );
}
