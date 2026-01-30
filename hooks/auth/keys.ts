export const authKeys = {
  all: ["auth"] as const,
  sessions: () => [...authKeys.all, "session"] as const,
  session: () => [...authKeys.sessions()] as const,
  users: () => [...authKeys.all, "user"] as const,
  user: (userId?: string) => [...authKeys.users(), userId] as const,
  currentUser: (userId?: string) =>
    [...authKeys.users(), "current", userId] as const,
};
