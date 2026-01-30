import {
  ProgramApplication,
  ApplicationStatus,
} from "@/models/programApplication";
import axiosInstance from "@/lib/axios/client";
import { ApiResponse, PaginationParams } from "@/lib/types/api";

export interface GetProgramApplicationsParams extends PaginationParams {
  programId: string;
  status?: ApplicationStatus;
}

export interface CreateProgramApplicationParams {
  programId: string;
  name: string;
  email: string;
  phone: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
}

export type ProgramApplicationsResponse = ApiResponse<ProgramApplication[]>;

export const getProgramApplications = async (
  params: GetProgramApplicationsParams,
): Promise<ProgramApplicationsResponse> => {
  const { programId, ...queryParams } = params;
  const response = await axiosInstance.get<ProgramApplicationsResponse>(
    `/programs/${programId}/applications`,
    {
      params: queryParams,
    },
  );
  return response.data;
};

export const createProgramApplication = async (
  params: CreateProgramApplicationParams,
): Promise<ProgramApplication> => {
  const { programId, ...body } = params;
  const response = await axiosInstance.post<ProgramApplication>(
    `/programs/${programId}/applications`,
    body,
  );
  return response.data;
};
