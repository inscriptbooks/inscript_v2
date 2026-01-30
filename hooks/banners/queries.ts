import { useQuery } from "@tanstack/react-query";
import { getBanners, getBannerById, GetBannersParams } from "./apis";
import { bannerKeys } from "./keys";
import { Banner } from "@/models/banner";

export const useGetBanners = (params?: GetBannersParams) => {
  return useQuery<Banner[], Error>({
    queryKey: bannerKeys.list(params || {}),
    queryFn: () => getBanners(params),
  });
};

export const useGetBanner = (id: string) => {
  return useQuery<Banner, Error>({
    queryKey: bannerKeys.detail(id),
    queryFn: () => getBannerById(id),
    enabled: !!id,
  });
};
