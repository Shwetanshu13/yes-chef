import { pgEnum, pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";

export const cuisineEnum = pgEnum("cuisine", [
    "continental",
    "north_indian",
    "south_indian",
    "english",
    "american",
    "chinese",
    "japanese",
    "mediterranean",
    "mexican",
    "thai",
]);

export const typeEnum = pgEnum("type", ["veg", "non_veg", "vegan"]);

export const courseEnum = pgEnum("course", [
    "starter",
    "appetizer",
    "main_course",
    "beverage",
    "dessert",
    "snack",
]);

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const recipes = pgTable("recipes", {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    cuisine: cuisineEnum("cuisine").notNull(),
    type: typeEnum("type").notNull(),
    course: courseEnum("course").notNull(),
    nutrition: jsonb("nutrition"),
    ingredients: jsonb("ingredients"),
    steps: jsonb("steps"),
    image: text("image"),
    link: text("link"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const friends = pgTable("friends", {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    friendId: uuid("friend_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    friendName: text("friend_name"),
    friendEmail: text("friend_email"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
