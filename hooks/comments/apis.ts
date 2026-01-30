import { Comment } from "@/models/comment";
import axiosInstance from "@/lib/axios/client";
import { ApiResponse, PaginationParams } from "@/lib/types/api";

export interface GetCommentsParams extends PaginationParams {
  memoId?: string;
  postId?: string;
  createdById?: string;
  includeHidden?: boolean;
}

export interface CreateCommentParams {
  memoId?: string;
  postId?: string;
  content: string;
}

export type CommentsResponse = ApiResponse<Comment[]>;

export const getComments = async (
  params?: GetCommentsParams,
): Promise<CommentsResponse> => {
  const response = await axiosInstance.get<CommentsResponse>("/comments", {
    params,
  });
  return response.data;
};

export const getCommentById = async (id: string): Promise<Comment> => {
  const response = await axiosInstance.get<Comment>(`/comments/${id}`);
  return response.data;
};

export const createComment = async (
  params: CreateCommentParams,
): Promise<Comment> => {
  const response = await axiosInstance.post<Comment>("/comments", params);
  return response.data;
};

export interface UpdateCommentParams {
  id: string;
  content: string;
}

export const updateComment = async ({
  id,
  content,
}: UpdateCommentParams): Promise<Comment> => {
  const response = await axiosInstance.patch<Comment>(`/comments/${id}`, {
    content,
  });
  return response.data;
};

export const deleteComment = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/comments/${id}`);
};

export interface ToggleCommentVisibilityParams {
  id: string;
  isVisible: boolean;
}

export const toggleCommentVisibility = async ({
  id,
  isVisible,
}: ToggleCommentVisibilityParams): Promise<Comment> => {
  const response = await axiosInstance.patch<Comment>(`/comments/${id}/visibility`, {
    is_visible: isVisible,
  });
  return response.data;
};
