import { GetLikesParams, GetLikedMemosParams, GetLikedPostsParams } from "./apis";

export const likeKeys = {
  all: ["likes"] as const,
  lists: () => [...likeKeys.all, "list"] as const,
  list: (filters: GetLikesParams) => [...likeKeys.lists(), filters] as const,
  details: () => [...likeKeys.all, "detail"] as const,
  detail: (id: string) => [...likeKeys.details(), id] as const,
  likedMemos: (params: GetLikedMemosParams) =>
    [...likeKeys.all, "memos", params] as const,
  likedPosts: (params: GetLikedPostsParams) =>
    [...likeKeys.all, "posts", params] as const,
};
