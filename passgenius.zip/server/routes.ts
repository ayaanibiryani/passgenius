
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.passwords.list.path, async (req, res) => {
    const passwords = await storage.getPasswords();
    res.json(passwords);
  });

  app.post(api.passwords.create.path, async (req, res) => {
    try {
      const input = api.passwords.create.input.parse(req.body);
      const password = await storage.createPassword(input);
      res.status(201).json(password);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.passwords.delete.path, async (req, res) => {
    await storage.deletePassword(Number(req.params.id));
    res.status(204).send();
  });

  // Simple seed for demo purposes
  const existing = await storage.getPasswords();
  if (existing.length === 0) {
    await storage.createPassword({
      label: "Example: Email",
      value: "Tr0ub4dour&3",
      strength: "Strong"
    });
    await storage.createPassword({
      label: "Example: WiFi",
      value: "correct-horse-battery-staple",
      strength: "Strong"
    });
  }

  return httpServer;
}
