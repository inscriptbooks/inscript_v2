import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { footerKeys } from "./keys";
import { footerApis, FooterData } from "./apis";
import { FooterManagementFormData } from "@/components/forms/schema";

export const useFooter = () => {
  return useQuery({
    queryKey: footerKeys.detail(),
    queryFn: footerApis.getFooter,
  });
};

export const useSaveFooter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FooterManagementFormData) => footerApis.saveFooter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: footerKeys.all });
    },
  });
};

export * from "./apis";
export * from "./keys";
