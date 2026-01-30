import { Play, ApplyStatus, PublicStatus } from "@/models/play";
import axiosInstance from "@/lib/axios/client";
import { ApiResponse, PaginationParams } from "@/lib/types/api";

export interface GetPlaysParams extends PaginationParams {
  createdById?: string;
  authorId?: string;
  keyword?: string;
  publicStatus?: PublicStatus;
  applyStatus?: ApplyStatus;
}

export interface PostPlayParams {
  title: string;
  author: string;
  line1?: string;
  line2?: string;
  line3?: string;
  year?: string;
  country?: string;
  keyword: string[];
  plot: string;
  femaleCharacterCount?: string;
  maleCharacterCount?: string;
  characterList?: string[];
  publicStatus?: PublicStatus;
  publicHistory?: string;
  // 판매 관련
  salesStatus?: "판매함" | "판매 안 함";
  price?: string | null;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
}

export type PlaysResponse = ApiResponse<Play[]>;

export const getPlays = async (
  params?: GetPlaysParams
): Promise<PlaysResponse> => {
  const response = await axiosInstance.get<PlaysResponse>("/plays", {
    params,
  });
  return response.data;
};

export const getPlayById = async (id: string): Promise<Play> => {
  const response = await axiosInstance.get<Play>(`/plays/${id}`);
  return response.data;
};

export const postPlay = async (params: PostPlayParams): Promise<Play> => {
  const response = await axiosInstance.post<Play>("/plays", params);
  return response.data;
};

export interface UpdatePlayParams extends PostPlayParams {
  id: string;
}

export const updatePlay = async (params: UpdatePlayParams): Promise<Play> => {
  const { id, ...data } = params;
  const response = await axiosInstance.patch<Play>(`/plays/${id}`, data);
  return response.data;
};
