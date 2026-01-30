import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage,
  deleteBannerImage,
} from "./apis";
import { bannerKeys } from "./keys";
import { Banner } from "@/models/banner";

export const useUploadBannerImage = () => {
  return useMutation({
    mutationFn: (file: File) => uploadBannerImage(file),
  });
};

export const useDeleteBannerImage = () => {
  return useMutation({
    mutationFn: (urlOrPath: string) => deleteBannerImage(urlOrPath),
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Banner) => createBanner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Banner }) =>
      updateBanner(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: bannerKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
    },
  });
};
