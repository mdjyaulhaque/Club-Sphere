import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const users = pgTable("users", {
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
    email: text("email").notNull().unique(),
    fullName: text("full_name").notNull(),
    schoolId: text("school_id").notNull(),
    role: text("role").notNull().default("student"), // student, leader, admin
    createdAt: timestamp("created_at").defaultNow(),
});
export const clubs = pgTable("clubs", {
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
    name: text("name").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(), // Academic, Sports, Arts, Technology, Service
    leaderId: varchar("leader_id").references(() => users.id),
    meetingTime: text("meeting_time"),
    meetingLocation: text("meeting_location"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
});
export const memberships = pgTable("memberships", {
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
    userId: varchar("user_id").references(() => users.id).notNull(),
    clubId: varchar("club_id").references(() => clubs.id).notNull(),
    role: text("role").notNull().default("member"), // member, officer
    joinedAt: timestamp("joined_at").defaultNow(),
});
export const announcements = pgTable("announcements", {
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
    title: text("title").notNull(),
    content: text("content").notNull(),
    clubId: varchar("club_id").references(() => clubs.id).notNull(),
    authorId: varchar("author_id").references(() => users.id).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
    id: true,
    createdAt: true,
});
export const insertClubSchema = createInsertSchema(clubs).omit({
    id: true,
    createdAt: true,
});
export const insertMembershipSchema = createInsertSchema(memberships).omit({
    id: true,
    joinedAt: true,
});
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
    id: true,
    createdAt: true,
});
