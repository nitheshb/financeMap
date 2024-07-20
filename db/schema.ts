import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { 
  integer, 
  pgTable, 
  text, 
  timestamp,
} from "drizzle-orm/pg-core";

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});

export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}));

export const insertAccountSchema = createInsertSchema(accounts);

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

export const insertCategorySchema = createInsertSchema(categories);

export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),
  payee: text("payee").notNull(),
  notes: text("notes"),
  date: timestamp("date", { mode: "date" }).notNull(),
  accountId: text("account_id").references(() => accounts.id, {
    onDelete: "cascade",
  }).notNull(),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  categories: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export const insertTransactionSchema = createInsertSchema(transactions, {
  date: z.coerce.date(),
});

export const connectedBanks = pgTable("connected_banks", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  accessToken: text("access_token").notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  subscriptionId: text("subscription_id").notNull().unique(),
  status: text("status").notNull(),
});



export const worksheets = pgTable("worksheets", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  address: text("address").notNull(),
  amount: integer("amount").notNull(),
  pillarsCount: integer("pillars_count").notNull(),
  beamsCount: integer("beams_count").notNull(),
  chainPulleys: text("chain_pulleys").notNull(),
});

export const insertWorksheetSchema = createInsertSchema(worksheets);




// export const events = pgTable("events", {
//   id: text("id").primaryKey(),
//   amount: integer("amount").notNull(),
//   host: text("host").notNull(), // Changed `payee` to `host`
//   description: text("description"), // Changed `notes` to `description`
//   date: timestamp("date", { mode: "date" }).notNull(),
//   accountId: text("account_id").references(() => accounts.id, {
//     onDelete: "cascade",
//   }).notNull(),
//   categoryId: text("category_id").references(() => categories.id, {
//     onDelete: "set null",
//   }),
// });

// export const eventsRelations = relations(events, ({ one }) => ({
//   account: one(accounts, {
//     fields: [events.accountId],
//     references: [accounts.id],
//   }),
//   categories: one(categories, {
//     fields: [events.categoryId],
//     references: [categories.id],
//   }),
// }));

// export const insertEventSchema = createInsertSchema(events, {
//   date: z.coerce.date(),
// });






export const events = pgTable("events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull(),
  userId: text("user_id").notNull(),
});

export const insertEventSchema = createInsertSchema(events);