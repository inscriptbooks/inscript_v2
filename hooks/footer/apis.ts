import { FooterManagementFormData } from "@/components/forms/schema";

export interface FooterData {
  id: number;
  company_name: string;
  business_number: string;
  address: string;
  email: string;
  mail_order_number: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export const footerApis = {
  getFooter: async (): Promise<FooterData | null> => {
    const response = await fetch("/api/footer");
    if (!response.ok) {
      const error = await response.json();
      return Promise.reject(error);
    }
    const result = await response.json();
    return result.data;
  },

  saveFooter: async (data: FooterManagementFormData): Promise<FooterData> => {
    const response = await fetch("/api/footer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return Promise.reject(error);
    }

    const result = await response.json();
    return result.data;
  },
};
