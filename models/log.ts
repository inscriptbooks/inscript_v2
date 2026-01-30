export interface PlayLog {
  id: string;
  playId: string | null;
  userId: string;
  eventType: string;
  createdAt: Date;
}

export type NewPlayLog = Omit<PlayLog, "id" | "createdAt">;
