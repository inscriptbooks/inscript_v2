export interface NoteSender {
  id: string;
  name: string;
  email: string;
  thumbnail: string | null;
}

export interface Note {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  sender?: NoteSender;
  is_reply: boolean;
}

export interface CreateNoteRequest {
  receiver_id: string;
  message: string;
}
