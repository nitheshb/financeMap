import { z } from "zod";
import { Hono } from "hono";
import { and, eq, inArray } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { db } from "@/db/drizzle";
import { worksheets, insertWorksheetSchema } from "@/db/schema";

const app = new Hono()
  .get(
    "/worksheets",
    clerkMiddleware(),
    async (c) => {
      const data = await db.select({
        id: worksheets.id,
        title: worksheets.title,
        address: worksheets.address,
        amount: worksheets.amount,
        pillarsCount: worksheets.pillarsCount,
        beamsCount: worksheets.beamsCount,
        chainPulleys: worksheets.chainPulleys,
      }).from(worksheets);

      return c.json({ data });
  })
  .get(
    "/worksheets/:id",
    zValidator("param", z.object({
      id: z.string().optional(),
    })),
    clerkMiddleware(),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db.select({
        id: worksheets.id,
        title: worksheets.title,
        address: worksheets.address,
        amount: worksheets.amount,
        pillarsCount: worksheets.pillarsCount,
        beamsCount: worksheets.beamsCount,
        chainPulleys: worksheets.chainPulleys,
      }).from(worksheets).where(eq(worksheets.id, id));
      
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .post(
    "/worksheets",
    clerkMiddleware(),
    zValidator("json", insertWorksheetSchema.omit({
      id: true,
    })),
    async (c) => {
      const values = c.req.valid("json");

      const [data] = await db.insert(worksheets).values({
        id: createId(),
        ...values,
      }).returning();

      return c.json({ data });
  })
  .patch(
    "/worksheets/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    zValidator(
      "json",
      insertWorksheetSchema.omit({
        id: true,
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db
        .update(worksheets)
        .set(values)
        .where(eq(worksheets.id, id))
        .returning();

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    },
  )
  .delete(
    "/worksheets/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db        .delete(worksheets)
        .where(eq(worksheets.id, id))
        .returning({
          id: worksheets.id,
        });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    },
  );

export default app;
