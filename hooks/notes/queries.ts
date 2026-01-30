import { useQuery } from "@tanstack/react-query";
import { getReceivedNotes } from "./apis";
import { noteKeys } from "./keys";

export const useReceivedNotes = () => {
  return useQuery({
    queryKey: noteKeys.lists(),
    queryFn: getReceivedNotes,
  });
};
