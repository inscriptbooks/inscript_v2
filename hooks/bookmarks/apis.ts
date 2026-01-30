import { Bookmark } from "@/models/bookmark";
import { Play } from "@/models/play";
import { Program } from "@/models/program";
import { Memo } from "@/models/memo";
import { Post } from "@/models/post";
import axiosInstance from "@/lib/axios/client";
import { ApiResponse, PaginationParams } from "@/lib/types/api";

export interface GetBookmarksParams {
  userId?: string;
  playId?: string;
  memoId?: string;
  authorId?: string;
  programId?: string;
  postId?: string;
}

export interface CreateBookmarkParams {
  playId?: string;
  memoId?: string;
  authorId?: string;
  programId?: string;
  postId?: string;
}

export interface DeleteBookmarkParams {
  playId?: string;
  memoId?: string;
  authorId?: string;
  programId?: string;
  postId?: string;
}

export const getBookmarks = async (
  params?: GetBookmarksParams,
): Promise<Bookmark[]> => {
  const response = await axiosInstance.get<Bookmark[]>("/bookmarks", {
    params,
  });
  return response.data;
};

export const getBookmarkById = async (id: string): Promise<Bookmark> => {
  const response = await axiosInstance.get<Bookmark>(`/bookmarks/${id}`);
  return response.data;
};

export const createBookmark = async (
  params: CreateBookmarkParams,
): Promise<Bookmark> => {
  const response = await axiosInstance.post<Bookmark>("/bookmarks", params);
  return response.data;
};

export const deleteBookmark = async (
  params: DeleteBookmarkParams,
): Promise<void> => {
  await axiosInstance.delete("/bookmarks", {
    data: params,
  });
};

export interface GetBookmarkedPlaysParams extends PaginationParams {}

export const getBookmarkedPlays = async (
  params?: GetBookmarkedPlaysParams,
): Promise<ApiResponse<Play[]>> => {
  const response = await axiosInstance.get<ApiResponse<Play[]>>(
    "/bookmarks/plays",
    {
      params,
    }
  );
  return response.data;
};

export interface GetBookmarkedProgramsParams extends PaginationParams {}

export const getBookmarkedPrograms = async (
  params?: GetBookmarkedProgramsParams,
): Promise<ApiResponse<Program[]>> => {
  const response = await axiosInstance.get<ApiResponse<Program[]>>(
    "/bookmarks/programs",
    {
      params,
    }
  );
  return response.data;
};

export interface GetBookmarkedMemosParams extends PaginationParams {}

export const getBookmarkedMemos = async (
  params?: GetBookmarkedMemosParams,
): Promise<ApiResponse<Memo[]>> => {
  const response = await axiosInstance.get<ApiResponse<Memo[]>>(
    "/bookmarks/memos",
    {
      params,
    }
  );
  return response.data;
};

export interface GetBookmarkedPostsParams extends PaginationParams {
  type?: string; // recruit, qna, market, promotion
}

export const getBookmarkedPosts = async (
  params?: GetBookmarkedPostsParams,
): Promise<ApiResponse<Post[]>> => {
  const response = await axiosInstance.get<ApiResponse<Post[]>>(
    "/bookmarks/posts",
    {
      params,
    }
  );
  return response.data;
};
