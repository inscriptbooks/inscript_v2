import { Banner, BannerType } from "@/models/banner";
import axiosInstance from "@/lib/axios/client";

export interface GetBannersParams {
  /** Banner type filter */
  type?: BannerType;
  /** Active status filter */
  isActive?: boolean;
  /**
   * Date filter - banners where start_date <= date <= end_date
   */
  date?: string;
}

export const getBanners = async (
  params?: GetBannersParams,
): Promise<Banner[]> => {
  const response = await axiosInstance.get<Banner[]>("/banners", {
    params,
  });
  return response.data;
};

export const getBannerById = async (id: string): Promise<Banner> => {
  const response = await axiosInstance.get<Banner>(`/banners/${id}`);
  return response.data;
};

export interface UploadImageResponse {
  url: string;
  path: string;
}

/**
 * 배너 이미지를 업로드합니다.
 * @param file - 업로드할 파일
 * @returns 업로드된 이미지의 URL과 경로
 */
export const uploadBannerImage = async (
  file: File,
): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post<UploadImageResponse>(
    "/banners/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

/**
 * 배너 이미지를 삭제합니다.
 * @param urlOrPath - 이미지 URL 또는 경로
 */
export const deleteBannerImage = async (urlOrPath: string): Promise<void> => {
  const params = urlOrPath.startsWith("http")
    ? { url: urlOrPath }
    : { path: urlOrPath };
  await axiosInstance.delete("/banners/storage", { params });
};

export const createBanner = async (data: Banner): Promise<Banner> => {
  const response = await axiosInstance.post<Banner>("/banners", data);
  return response.data;
};

export const updateBanner = async (
  id: string,
  data: Banner,
): Promise<Banner> => {
  const response = await axiosInstance.put<Banner>(`/banners/${id}`, data);
  return response.data;
};

export const deleteBanner = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/banners/${id}`);
};
