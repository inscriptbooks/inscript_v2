import { Author, AuthorRequestStatus } from "@/models/author";
import axiosInstance from "@/lib/axios/client";
import { ApiResponse, PaginationParams } from "@/lib/types/api";

export interface GetAuthorsParams extends PaginationParams {
  keyword?: string;
  requestStatus?: AuthorRequestStatus;
}

export type AuthorsResponse = ApiResponse<Author[]>;

export const getAuthors = async (
  params?: GetAuthorsParams
): Promise<AuthorsResponse> => {
  const response = await axiosInstance.get<AuthorsResponse>("/authors", {
    params,
  });
  return response.data;
};

export const getAuthorById = async (id: string): Promise<Author> => {
  const response = await axiosInstance.get<Author>(`/authors/${id}`);
  return response.data;
};
