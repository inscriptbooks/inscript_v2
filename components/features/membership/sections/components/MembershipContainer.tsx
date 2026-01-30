"use client";

import { useState } from "react";
import {
  MembershipStatusCard,
  MembershipSubscriptionCard,
} from "../../components";

interface MembershipContainerProps {
  initialData: {
    name: string;
    membership: boolean;
    membershipStartDate: string | null;
  };
}

export function MembershipContainer({ initialData }: MembershipContainerProps) {
  const [membershipData, setMembershipData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);

    const response = await fetch("/api/membership", {
      method: "POST",
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        setMembershipData({
          name: result.data.name,
          membership: result.data.membership,
          membershipStartDate: result.data.membershipStartDate,
        });
      }
    }

    setIsLoading(false);
  };

  const handleCancel = async () => {
    setIsLoading(true);

    const response = await fetch("/api/membership", {
      method: "DELETE",
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        setMembershipData({
          name: result.data.name,
          membership: result.data.membership,
          membershipStartDate: null,
        });
      }
    }

    setIsLoading(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <section className="flex w-full flex-col items-center justify-center gap-[40px]">
      {membershipData.membership ? (
        <MembershipStatusCard
          userName={membershipData.name}
          subscriptionStartDate={formatDate(membershipData.membershipStartDate)}
          onCancelClick={handleCancel}
        />
      ) : (
        <MembershipSubscriptionCard
          userName={membershipData.name}
          onSubscribeClick={handleSubscribe}
        />
      )}
    </section>
  );
}
