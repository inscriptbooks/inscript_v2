import { Report } from "@/models/report";
import axiosInstance from "@/lib/axios/client";
import { ApiResponse, PaginationParams } from "@/lib/types/api";

export interface GetReportsParams extends PaginationParams {
  memoId?: string;
  postId?: string;
  commentId?: string;
}

export interface CreateReportParams {
  memoId?: string;
  postId?: string;
  commentId?: string;
  reason: string;
}

export type ReportsResponse = ApiResponse<Report[]>;

export const getReports = async (
  params?: GetReportsParams
): Promise<ReportsResponse> => {
  const response = await axiosInstance.get<ReportsResponse>("/reports", {
    params,
  });
  return response.data;
};

export const getReportById = async (id: string): Promise<Report> => {
  const response = await axiosInstance.get<Report>(`/reports/${id}`);
  return response.data;
};

export const createReport = async (
  params: CreateReportParams
): Promise<Report> => {
  const response = await axiosInstance.post<Report>("/reports", params);
  return response.data;
};
