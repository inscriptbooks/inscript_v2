export interface DashboardStats {
  users: {
    new: number;
    total: number;
  };
  plays: {
    new: number;
    total: number;
  };
  authors: {
    new: number;
    total: number;
  };
  posts: {
    newPosts: number;
    newComments: number;
  };
  reports: {
    new: number;
    incomplete: number;
  };
}

export interface ProgramApplication {
  id: string;
  email: string;
  title: string;
  user: string;
  date: string;
}

export interface SearchKeyword {
  keyword: string;
  count: number;
}
