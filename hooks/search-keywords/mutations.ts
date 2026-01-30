import { useMutation } from "@tanstack/react-query";
import { saveSearchKeyword, SaveSearchKeywordParams } from "./apis";
import { searchKeywordKeys } from "./keys";

export const useSaveSearchKeyword = () => {
  return useMutation({
    mutationKey: searchKeywordKeys.save(),
    mutationFn: (params: SaveSearchKeywordParams) => saveSearchKeyword(params),
  });
};
