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
    "/",
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .select({
          id: worksheets.id,
          title: worksheets.title,
          address: worksheets.address,
          amount: worksheets.amount,
          pillarsCount: worksheets.pillarsCount,
          beamsCount: worksheets.beamsCount,
          chainPulleys: worksheets.chainPulleys,
        })
        .from(worksheets)
        .where(eq(worksheets.userId, auth.userId));

      return c.json({ data });
  })
  .get(
    "/:id",
    zValidator("param", z.object({
      id: z.string().optional(),
    })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }
      
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .select({
          id: worksheets.id,
          title: worksheets.title,
          address: worksheets.address,
          amount: worksheets.amount,
          pillarsCount: worksheets.pillarsCount,
          beamsCount: worksheets.beamsCount,
          chainPulleys: worksheets.chainPulleys,
        })
        .from(worksheets)
        .where(
          and(
            eq(worksheets.userId, auth.userId),
            eq(worksheets.id, id)
          ),
        );
      
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertWorksheetSchema.pick({
      title: true,
      address: true,
      amount: true,
      pillarsCount: true,
      beamsCount: true,
      chainPulleys: true,
    })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db.insert(worksheets).values({
        id: createId(),
        userId: auth.userId,
        ...values,
      }).returning();

      return c.json({ data });
  })
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .delete(worksheets)
        .where(
          and(
            eq(worksheets.userId, auth.userId),
            inArray(worksheets.id, values.ids)
          )
        )
        .returning({
          id: worksheets.id,
        });

      return c.json({ data });
    },
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    zValidator(
      "json",
      insertWorksheetSchema.pick({
        title: true,
        address: true,
        amount: true,
        pillarsCount: true,
        beamsCount: true,
        chainPulleys: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .update(worksheets)
        .set(values)
        .where(
          and(
            eq(worksheets.userId, auth.userId),
            eq(worksheets.id, id),
          ),
        )
        .returning();

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    },
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .delete(worksheets)
        .where(
          and(
            eq(worksheets.userId, auth.userId),
            eq(worksheets.id, id),
          ),
        )
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
