"use client";

import { NotificationManagementForm } from "@/components/forms";
import { useEffect, useState } from "react";
import { NotificationManagementFormData } from "@/components/forms/schema";
import { useLoader } from "@/hooks/common";
import NotificationSettingsSuccessModal from "./NotificationSettingsSuccessModal";

export default function NotificationSettingsLoader() {
  const { showLoader, hideLoader } = useLoader();
  const [settings, setSettings] =
    useState<NotificationManagementFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/notifications/settings");
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        // 에러 발생 시 처리
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }

    return () => {
      hideLoader();
    };
  }, [isLoading, showLoader, hideLoader]);

  const handleSubmit = async (data: NotificationManagementFormData) => {
    try {
      showLoader();
      const response = await fetch("/api/notifications/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSettings(data);
        setShowSuccessModal(true);
      }
    } catch (error) {
      // 에러 발생 시 처리
    } finally {
      hideLoader();
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <>
      <NotificationManagementForm
        defaultValues={settings || undefined}
        onSubmit={handleSubmit}
      />
      <NotificationSettingsSuccessModal
        open={showSuccessModal}
        onClose={handleCloseModal}
      />
    </>
  );
}
