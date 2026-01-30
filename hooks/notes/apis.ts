import axiosClient from "@/lib/axios/client";
import { CreateNoteRequest, Note } from "@/models/note";

export const createNote = async (data: CreateNoteRequest): Promise<Note> => {
  try {
    const response = await axiosClient.post("/notes", data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getReceivedNotes = async (): Promise<Note[]> => {
  const response = await axiosClient.get("/notes");
  return response.data;
};

export const updateNote = async (
  id: string,
  data: Partial<Note>
): Promise<Note> => {
  try {
    const response = await axiosClient.put(`/notes/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
