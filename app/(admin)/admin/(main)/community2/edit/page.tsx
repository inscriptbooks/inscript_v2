import { Suspense } from "react";
import CommunityEditContent from "./components/CommunityEditContent";

export default function CommunityEditPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <CommunityEditContent />
    </Suspense>
  );
}
