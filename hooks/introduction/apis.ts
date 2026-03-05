export interface IntroductionData {
  id: number;
  created_at: string;
  url: string;
  category: "upper" | "lower";
  device: "pc" | "mobile";
}

export const introductionApis = {
  getIntroduction: async (): Promise<IntroductionData[]> => {
    const response = await fetch("/api/introduction");
    if (!response.ok) {
      const error = await response.json();
      return Promise.reject(error);
    }
    const result = await response.json();
    return result.data;
  },
};
