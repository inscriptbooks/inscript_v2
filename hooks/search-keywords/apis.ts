import axiosInstance from "@/lib/axios/client";

export interface SaveSearchKeywordParams {
  keyword: string;
}

export const saveSearchKeyword = async (
  params: SaveSearchKeywordParams,
): Promise<{ message: string }> => {
  const response = await axiosInstance.post<{ message: string }>(
    "/search-keywords",
    params,
  );
  return response.data;
};
