import { Post, PostType } from "@/models/post";
import axiosInstance from "@/lib/axios/client";
import { ApiResponse, PaginationParams } from "@/lib/types/api";
import { CommunityPostUploadFormData } from "@/components/forms/schema";

export interface GetPostsParams extends PaginationParams {
  createdById?: string;
  keyword?: string;
  type?: PostType;
  sortBy?: "viewCount" | "createdAt";
  filterType?: "title" | "author" | "titleContent";
}

export type PostsResponse = ApiResponse<Post[]>;

export const getPosts = async (
  params?: GetPostsParams
): Promise<PostsResponse> => {
  const response = await axiosInstance.get<PostsResponse>("/posts", {
    params,
  });
  return response.data;
};

export const getPostById = async (id: string): Promise<Post> => {
  const response = await axiosInstance.get<Post>(`/posts/${id}`);
  return response.data;
};

export type CreatePostParams = CommunityPostUploadFormData & {
  file?: File | null;
};

export const createPost = async (params: CreatePostParams): Promise<Post> => {
  const { file, ...postData } = params;

  // 파일이 있으면 FormData로 전송, 없으면 JSON으로 전송
  if (file) {
    const formData = new FormData();
    formData.append("type", postData.type);
    formData.append("category", postData.category);
    formData.append("title", postData.title);
    formData.append("content", postData.content);
    formData.append("file", file);

    const response = await axiosInstance.post<Post>("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } else {
    const response = await axiosInstance.post<Post>("/posts", postData);
    return response.data;
  }
};

export interface UpdatePostParams {
  id: string;
  type: string;
  category: string;
  title: string;
  content: string;
  isVisible?: boolean;
}

export const updatePost = async (params: UpdatePostParams): Promise<Post> => {
  const { id, ...data } = params;
  const response = await axiosInstance.patch<Post>(`/posts/${id}`, data);
  return response.data;
};
