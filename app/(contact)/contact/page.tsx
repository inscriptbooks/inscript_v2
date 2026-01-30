"use client";

import { useState } from "react";
import { ContactForm } from "@/components/forms";
import ContactSuccessModal from "@/components/features/contact/ContactSuccessModal";

export default function ContactPage() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSuccess = () => {
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <section className="flex min-h-screen w-full flex-col items-center">
      {/* Header Section */}
      <div className="flex w-full flex-col items-start gap-2.5 border-b border-primary px-[20px] pb-5 pt-20 lg:px-[120px]">
        <div className="flex w-full items-start gap-6">
          <div className="flex flex-1 flex-col items-start gap-3">
            <h1 className="font-serif text-[28px] font-bold leading-8 text-primary">
              문의
            </h1>
            <p className="w-full text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
              인스크립트에게 문의 메일을 남기세요.
            </p>
          </div>
        </div>
      </div>

      <ContactForm onSuccess={handleSuccess} />

      <ContactSuccessModal open={showSuccessModal} onClose={handleCloseModal} />
    </section>
  );
}
