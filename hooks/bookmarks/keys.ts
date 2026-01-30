import {
  GetBookmarksParams,
  GetBookmarkedPlaysParams,
  GetBookmarkedProgramsParams,
  GetBookmarkedMemosParams,
  GetBookmarkedPostsParams,
} from "./apis";

export const bookmarkKeys = {
  all: ["bookmarks"] as const,
  lists: () => [...bookmarkKeys.all, "list"] as const,
  list: (filters: GetBookmarksParams) =>
    [...bookmarkKeys.lists(), filters] as const,
  details: () => [...bookmarkKeys.all, "detail"] as const,
  detail: (id: string) => [...bookmarkKeys.details(), id] as const,
  bookmarkedPlays: (filters: GetBookmarkedPlaysParams) =>
    [...bookmarkKeys.all, "plays", filters] as const,
  bookmarkedPrograms: (filters: GetBookmarkedProgramsParams) =>
    [...bookmarkKeys.all, "programs", filters] as const,
  bookmarkedMemos: (filters: GetBookmarkedMemosParams) =>
    [...bookmarkKeys.all, "memos", filters] as const,
  bookmarkedPosts: (filters: GetBookmarkedPostsParams) =>
    [...bookmarkKeys.all, "posts", filters] as const,
};
