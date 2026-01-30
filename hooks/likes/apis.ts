import { Like } from "@/models/like";
import { Memo } from "@/models/memo";
import axiosInstance from "@/lib/axios/client";
import { ApiResponse, PaginationParams } from "@/lib/types/api";

export interface GetLikesParams {
  userId?: string;
  memoId?: string;
  postId?: string;
}

export interface GetLikedMemosParams extends PaginationParams {
  // 추가 필터링 파라미터가 필요하면 여기 추가
}

export interface CreateLikeParams {
  memoId?: string;
  postId?: string;
}

export interface DeleteLikeParams {
  memoId?: string;
  postId?: string;
}

export const getLikes = async (params?: GetLikesParams): Promise<Like[]> => {
  const response = await axiosInstance.get<Like[]>("/likes", {
    params,
  });
  return response.data;
};

export const getLikeById = async (id: string): Promise<Like> => {
  const response = await axiosInstance.get<Like>(`/likes/${id}`);
  return response.data;
};

export const createLike = async (params: CreateLikeParams): Promise<Like> => {
  const response = await axiosInstance.post<Like>("/likes", params);
  return response.data;
};

export const deleteLike = async (params: DeleteLikeParams): Promise<void> => {
  await axiosInstance.delete("/likes", {
    data: params,
  });
};

export type LikedMemosResponse = ApiResponse<Memo[]>;

export const getLikedMemos = async (
  params?: GetLikedMemosParams,
): Promise<LikedMemosResponse> => {
  const response = await axiosInstance.get<LikedMemosResponse>("/likes/memos", {
    params,
  });
  return response.data;
};

export interface GetLikedPostsParams extends PaginationParams {
  type?: string; // recruit, qna, market, promotion
}

export const getLikedPosts = async (
  params?: GetLikedPostsParams,
): Promise<ApiResponse<any[]>> => {
  const response = await axiosInstance.get<ApiResponse<any[]>>("/likes/posts", {
    params,
  });
  return response.data;
};
