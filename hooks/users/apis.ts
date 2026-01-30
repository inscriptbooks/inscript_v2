import { User, UserRole, UserStatus } from "@/models/user";
import axiosInstance from "@/lib/axios/client";
import { ApiResponse, PaginationParams } from "@/lib/types/api";

export interface GetUsersParams extends PaginationParams {
  role?: UserRole;
  status?: UserStatus;
}

export type UsersResponse = ApiResponse<User[]>;

export const getUsers = async (
  params?: GetUsersParams,
): Promise<UsersResponse> => {
  const response = await axiosInstance.get<UsersResponse>("/users", {
    params,
  });
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await axiosInstance.get<User>(`/users/${id}`);
  return response.data;
};
