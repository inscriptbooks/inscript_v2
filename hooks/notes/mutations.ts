import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "./apis";
import { noteKeys } from "./keys";
import { CreateNoteRequest } from "@/models/note";

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNoteRequest) => createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
    },
  });
};
