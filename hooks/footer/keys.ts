export const footerKeys = {
  all: ["footer"] as const,
  detail: () => [...footerKeys.all, "detail"] as const,
};
