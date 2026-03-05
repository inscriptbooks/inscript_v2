export const introductionKeys = {
  all: ["introduction"] as const,
  list: () => [...introductionKeys.all, "list"] as const,
};
