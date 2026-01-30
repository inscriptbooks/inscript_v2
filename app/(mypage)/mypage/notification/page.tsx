import { NotificationManagementForm } from "@/components/forms";
import { Suspense } from "react";
import NotificationSettingsLoader from "./components/NotificationSettingsLoader";

export default function MyPageNotification() {
  return (
    <section className="flex w-full flex-1 flex-col items-center">
      <Suspense fallback={<div>로딩 중...</div>}>
        <NotificationSettingsLoader />
      </Suspense>
    </section>
  );
}
