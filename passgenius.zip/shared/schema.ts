
import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const savedPasswords = pgTable("saved_passwords", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  strength: text("strength"), // e.g., "Strong", "Medium", "Weak"
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSavedPasswordSchema = createInsertSchema(savedPasswords).omit({ 
  id: true, 
  createdAt: true 
});

export type SavedPassword = typeof savedPasswords.$inferSelect;
export type InsertSavedPassword = z.infer<typeof insertSavedPasswordSchema>;

export type CreatePasswordRequest = InsertSavedPassword;
export type UpdatePasswordRequest = Partial<InsertSavedPassword>;
