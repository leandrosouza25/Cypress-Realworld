///<reference path="types.ts" />

import express, { Request, Response } from "express";
import { getAllForEntity, seedDatabase } from "./database";
import { validateMiddleware } from "./helpers";
import { isValidEntityValidator } from "./validators";
import { DbSchema } from "../src/models/db-schema";

const router = express.Router();

// POST /testData/seed
router.post("/seed", (req: Request, res: Response) => {
  seedDatabase();
  res.sendStatus(200);
});

// GET /testData/:entity
router.get(
  "/:entity",
  validateMiddleware([...isValidEntityValidator]),
  (req: Request, res: Response) => {
    const { entity } = req.params;
    const results = getAllForEntity(entity as keyof DbSchema);

    res.status(200).json({ results });
  }
);

// POST /testData/filter
router.post(
  "/filter",
  validateMiddleware([...isValidEntityValidator]),
  (req: Request, res: Response) => {
    const { entity, query } = req.body;

    if (!entity) {
      return res.status(400).json({ error: "Entity is required" });
    }

    const allRecords = getAllForEntity(entity as keyof DbSchema);

    if (!allRecords) {
      return res.status(404).json({ error: `Entity '${entity}' not found` });
    }

    // Filtra os registros com base no query (igualdade exata)
    const filtered = allRecords.filter((item: any) => {
      if (!query || Object.keys(query).length === 0) return true;
      return Object.keys(query).every((key) => item[key] === query[key]);
    });

    res.status(200).json(filtered);
  }
);

export default router;