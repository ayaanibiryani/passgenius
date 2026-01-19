
import { db } from "./db";
import {
  savedPasswords,
  type CreatePasswordRequest,
  type SavedPassword
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getPasswords(): Promise<SavedPassword[]>;
  createPassword(password: CreatePasswordRequest): Promise<SavedPassword>;
  deletePassword(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getPasswords(): Promise<SavedPassword[]> {
    return await db.select().from(savedPasswords).orderBy(desc(savedPasswords.createdAt));
  }

  async createPassword(password: CreatePasswordRequest): Promise<SavedPassword> {
    const [saved] = await db.insert(savedPasswords).values(password).returning();
    return saved;
  }

  async deletePassword(id: number): Promise<void> {
    await db.delete(savedPasswords).where(eq(savedPasswords.id, id));
  }
}

export const storage = new DatabaseStorage();
