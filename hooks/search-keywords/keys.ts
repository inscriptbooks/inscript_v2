export const searchKeywordKeys = {
  all: ["searchKeywords"] as const,
  save: () => [...searchKeywordKeys.all, "save"] as const,
};
