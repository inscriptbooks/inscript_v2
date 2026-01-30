import { ReactNode } from "react";

export interface PlayPurchaseListItem {
  id: string;
  title: string;
  author: string;
  price: number;
  selected: boolean;
}

export interface PlayPurchaseListSectionProps {
  heading?: string;
  items: PlayPurchaseListItem[];
  onToggleItem: (id: string) => void;
  totalPrice: number;
  onCheckout: () => void;
  agreeRefundTerms?: boolean;
  onToggleRefundTerms?: (checked: boolean) => void;
  onShowRefundTerms?: () => void;
  isCheckoutDisabled?: boolean;
  checkoutButtonLabel?: string;
  deleteAction?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  className?: string;
}
