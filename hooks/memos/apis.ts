import { Memo, MemoType } from "@/models/memo";
import axiosInstance from "@/lib/axios/client";
import { ApiResponse, PaginationParams } from "@/lib/types/api";

export interface GetMemosParams extends PaginationParams {
  type?: MemoType;
  playId?: string;
  authorId?: string;
  programId?: string;
  createdById?: string;
  keyword?: string;
}

export interface CreateMemoParams {
  type: MemoType;
  content: string;
  playId?: string;
  authorId?: string;
  programId?: string;
}

export interface UpdateMemoParams {
  id: string;
  content?: string;
}

export type MemosResponse = ApiResponse<Memo[]>;

export const getMemos = async (
  params?: GetMemosParams,
): Promise<MemosResponse> => {
  const response = await axiosInstance.get<MemosResponse>("/memos", {
    params,
  });
  return response.data;
};

export const getMemoById = async (id: string): Promise<Memo> => {
  const response = await axiosInstance.get<Memo>(`/memos/${id}`);
  return response.data;
};

export const createMemo = async (params: CreateMemoParams): Promise<Memo> => {
  const response = await axiosInstance.post<Memo>("/memos", params);
  return response.data;
};

export const updateMemo = async (params: UpdateMemoParams): Promise<Memo> => {
  const { id, ...updateData } = params;
  const response = await axiosInstance.patch<Memo>(`/memos/${id}`, updateData);
  return response.data;
};

export const deleteMemo = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/memos/${id}`);
};
