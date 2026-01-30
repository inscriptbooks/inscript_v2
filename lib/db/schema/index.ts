import { relations } from "drizzle-orm";
import { users } from "./users";
import { authors } from "./authors";
import { plays } from "./plays";
import { programs } from "./programs";
import { memos } from "./memos";
import { posts } from "./posts";
import { comments } from "./comments";
import { banners } from "./banners";
import { bookmarks } from "./bookmarks";
import { likes } from "./likes";
import { programApplications } from "./programApplications";
import { reports } from "./reports";
import { searchKeywords } from "./searchKeywords";
import { playLogs } from "./logs";

// Define and export relations
const userRelations = relations(users, ({ one, many }) => ({
  author: one(authors, {
    fields: [users.id],
    references: [authors.id],
  }),
  createdPlays: many(plays, { relationName: "plays_created_by_user" }),
  memos: many(memos),
  posts: many(posts),
  comments: many(comments),
  bookmarks: many(bookmarks),
  likes: many(likes),
  reports: many(reports),
  searchKeywords: many(searchKeywords),
  playLogs: many(playLogs),
}));

const authorRelations = relations(authors, ({ one, many }) => ({
  user: one(users, {
    fields: [authors.id],
    references: [users.id],
  }),
  plays: many(plays),
  memos: many(memos),
  bookmarks: many(bookmarks),
}));

const playRelations = relations(plays, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [plays.createdById],
    references: [users.id],
    relationName: "plays_created_by_user",
  }),
  author: one(authors, {
    fields: [plays.authorId],
    references: [authors.id],
  }),
  memos: many(memos),
  bookmarks: many(bookmarks),
  playLogs: many(playLogs),
}));

const programRelations = relations(programs, ({ many }) => ({
  memos: many(memos),
  bookmarks: many(bookmarks),
  applications: many(programApplications),
}));

const memoRelations = relations(memos, ({ one, many }) => ({
  user: one(users, {
    fields: [memos.userId],
    references: [users.id],
  }),
  play: one(plays, {
    fields: [memos.playId],
    references: [plays.id],
  }),
  author: one(authors, {
    fields: [memos.authorId],
    references: [authors.id],
  }),
  program: one(programs, {
    fields: [memos.programId],
    references: [programs.id],
  }),
  comments: many(comments),
  likes: many(likes),
  bookmarks: many(bookmarks),
  reports: many(reports),
}));

const postRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(comments),
  likes: many(likes),
  bookmarks: many(bookmarks),
  reports: many(reports),
}));

const commentRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  memo: one(memos, {
    fields: [comments.memoId],
    references: [memos.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  reports: many(reports),
}));

const bookmarkRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
  play: one(plays, {
    fields: [bookmarks.playId],
    references: [plays.id],
  }),
  memo: one(memos, {
    fields: [bookmarks.memoId],
    references: [memos.id],
  }),
  author: one(authors, {
    fields: [bookmarks.authorId],
    references: [authors.id],
  }),
  program: one(programs, {
    fields: [bookmarks.programId],
    references: [programs.id],
  }),
  post: one(posts, {
    fields: [bookmarks.postId],
    references: [posts.id],
  }),
}));

const likeRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  memo: one(memos, {
    fields: [likes.memoId],
    references: [memos.id],
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
}));

const programApplicationRelations = relations(
  programApplications,
  ({ one }) => ({
    program: one(programs, {
      fields: [programApplications.programId],
      references: [programs.id],
    }),
    user: one(users, {
      fields: [programApplications.userId],
      references: [users.id],
    }),
  })
);

const reportRelations = relations(reports, ({ one }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
  memo: one(memos, {
    fields: [reports.memoId],
    references: [memos.id],
  }),
  post: one(posts, {
    fields: [reports.postId],
    references: [posts.id],
  }),
  comment: one(comments, {
    fields: [reports.commentId],
    references: [comments.id],
  }),
}));

const searchKeywordRelations = relations(searchKeywords, ({ one }) => ({
  user: one(users, {
    fields: [searchKeywords.userId],
    references: [users.id],
  }),
}));

const playLogRelations = relations(playLogs, ({ one }) => ({
  user: one(users, {
    fields: [playLogs.userId],
    references: [users.id],
  }),
  play: one(plays, {
    fields: [playLogs.playId],
    references: [plays.id],
  }),
}));

// Combined schema for Drizzle
export const schema = {
  users,
  authors,
  plays,
  programs,
  memos,
  posts,
  comments,
  banners,
  bookmarks,
  likes,
  programApplications,
  reports,
  searchKeywords,
  playLogs,
  userRelations,
  authorRelations,
  playRelations,
  programRelations,
  memoRelations,
  postRelations,
  commentRelations,
  bookmarkRelations,
  likeRelations,
  programApplicationRelations,
  reportRelations,
  searchKeywordRelations,
  playLogRelations,
};

export * from "./users";
export * from "./authors";
export * from "./plays";
export * from "./programs";
export * from "./memos";
export * from "./posts";
export * from "./comments";
export * from "./banners";
export * from "./bookmarks";
export * from "./likes";
export * from "./programApplications";
export * from "./reports";
export * from "./searchKeywords";
export * from "./logs";
