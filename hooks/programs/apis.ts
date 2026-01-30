import { Program, ProgramStatus } from "@/models/program";
import axiosInstance from "@/lib/axios/client";
import { ApiResponse, PaginationParams } from "@/lib/types/api";

export interface GetProgramsParams extends PaginationParams {
  status?: ProgramStatus;
  keyword?: string;
  year?: number;
  month?: number;
  isVisible?: boolean;
}

export type ProgramsResponse = ApiResponse<Program[]>;

export const getPrograms = async (
  params?: GetProgramsParams,
): Promise<ProgramsResponse> => {
  const response = await axiosInstance.get<ProgramsResponse>("/programs", {
    params,
  });
  return response.data;
};

export const getProgramById = async (id: string): Promise<Program> => {
  const response = await axiosInstance.get<Program>(`/programs/${id}`);
  return response.data;
};
