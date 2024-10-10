import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { subDays, parse, differenceInDays } from "date-fns";
import { and, desc, eq, gte, lt, lte, sql, sum } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { accounts, categories, transactions } from "@/db/schema";
import { calculatePercentageChange, fillMissingDays } from "@/lib/utils";
import { steamTransactionsListNew } from "@/db/dbQueryFirebase";

const app = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { from, to, accountId } = c.req.valid("query");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const defaultTo = new Date();
      // const defaultFrom = subDays(defaultTo, 30);
      const defaultFrom = new Date(defaultTo.getFullYear(), 0, 1);

      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;
      const endDate = to
        ? parse(to, "yyyy-MM-dd", new Date())
        : defaultTo;

      const periodLength = differenceInDays(endDate, startDate) + 1;
      const lastPeriodStart = subDays(startDate, periodLength);
      const lastPeriodEnd = subDays(endDate, periodLength);

      async function fetchFinancialData(
        userId: string,
        startDate: Date,
        endDate: Date,
      ) {
         await db
          .select({
            income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
            expenses: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
            remaining: sum(transactions.amount).mapWith(Number),
          })
          .from(transactions)
          .innerJoin(
            accounts,
            eq(
              transactions.accountId,
              accounts.id,
            ),
          )
          .where(
            and(
              accountId ? eq(transactions.accountId, accountId) : undefined,
              eq(accounts.userId, userId),
              gte(transactions.date, startDate),
              lte(transactions.date, endDate),
            )
          );
      // const unsubscribe = await steamTransactionsListNew('pride')

        return [{income: 10, expenses: 10000, remaining: 100}];
    
      };

      const [currentPeriod] = await fetchFinancialData(
        auth.userId,
        startDate,
        endDate,
      );
      const [lastPeriod] = await fetchFinancialData(
        auth.userId,
        lastPeriodStart,
        lastPeriodEnd,
      );

      const incomeChange = calculatePercentageChange(
        currentPeriod.income,
        lastPeriod.income,
      );
      const expensesChange = calculatePercentageChange(
        currentPeriod.expenses,
        lastPeriod.expenses,
      );
      const remainingChange = calculatePercentageChange(
        currentPeriod.remaining,
        lastPeriod.remaining,
      );

      const category = await db
        .select({
          name: categories.name,
          value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),
        })
        .from(transactions)
        .innerJoin(
          accounts,
          eq(
            transactions.accountId,
            accounts.id,
          ),
        )
        .innerJoin(
          categories,
          eq(
            transactions.categoryId,
            categories.id,
          )
        )
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, auth.userId),
            lt(transactions.amount, 0),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate),
          )
        )
        .groupBy(categories.name)
        .orderBy(desc(
          sql`SUM(ABS(${transactions.amount}))`
        ));

      const topCategories = category.slice(0, 3);
      const otherCategories = category.slice(3);
      const otherSum = otherCategories
        .reduce((sum, current) => sum + current.value, 0);

      const finalCategories = topCategories;
      if (otherCategories.length > 0) {
        finalCategories.push({ 
          name: "Other",
          value: otherSum,
        });
      }

      const activeDays = await db
        .select({
          date: transactions.date,
          income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
          expenses: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount}) ELSE 0 END)`.mapWith(Number),
        })
        .from(transactions)
        .innerJoin(
          accounts,
          eq(
            transactions.accountId,
            accounts.id,
          ),
        )
        .where(
          and(
            accountId ? 
              eq(transactions.accountId, accountId) 
              : undefined,
            eq(accounts.userId, auth.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate),
          )
        )
        .groupBy(transactions.date)
        .orderBy(transactions.date);

      const days = fillMissingDays(
        activeDays,
        startDate,
        endDate,
      );

      return c.json({
        data: {
          remainingAmount: currentPeriod.remaining,
          remainingChange,
          incomeAmount: currentPeriod.income,
          incomeChange,
          expensesAmount: currentPeriod.expenses,
          expensesChange,
          categories: finalCategories,
          days,
        },
      });
    },
  );

export default app;


const app1 = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { from, to, accountId } = c.req.valid("query");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const defaultTo = new Date();
      const defaultFrom = new Date(defaultTo.getFullYear(), 0, 1);

      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;
      const endDate = to
        ? parse(to, "yyyy-MM-dd", new Date())
        : defaultTo;

      const periodLength = differenceInDays(endDate, startDate) + 1;
      const lastPeriodStart = subDays(startDate, periodLength);
      const lastPeriodEnd = subDays(endDate, periodLength);

      async function fetchFinancialData(
        userId: string,
        startDate: Date,
        endDate: Date,
      ) {
      const unsubscribe = await steamTransactionsListNew('pride')

        // const transactionsRef = collection(db, 'transactions');
        // const accountsRef = collection(db, 'accounts');

        // let queryRef = query(
        //   transactionsRef,
        //   where('userId', '==', userId),
        //   where('date', '>=', startDate),
        //   where('date', '<=', endDate)
        // );

        // if (accountId) {
        //   queryRef = query(queryRef, where('accountId', '==', accountId));
        // }

        // const snapshot = await getDocs(queryRef);
        let income = 0, expenses = 0, remaining = 0;

        unsubscribe.forEach(data => {
          // const data = doc.data();
          const amount = data.amount;
          if (amount >= 0) {
            income += amount;
          } else {
            expenses += amount;
          }
          remaining += amount;
        });

        return { income, expenses, remaining };
      }

      const currentPeriod = await fetchFinancialData(
        auth.userId,
        startDate,
        endDate,
      );

      const lastPeriod = await fetchFinancialData(
        auth.userId,
        lastPeriodStart,
        lastPeriodEnd,
      );

      const incomeChange = calculatePercentageChange(
        currentPeriod.income,
        lastPeriod.income,
      );
      const expensesChange = calculatePercentageChange(
        currentPeriod.expenses,
        lastPeriod.expenses,
      );
      const remainingChange = calculatePercentageChange(
        currentPeriod.remaining,
        lastPeriod.remaining,
      );

      async function fetchCategoryData(
        userId: string,
        startDate: Date,
        endDate: Date,
      ) {
      const unsubscribe = await steamTransactionsListNew('pride')

        // const transactionsRef = collection(db, 'transactions');
        // let queryRef = query(
        //   transactionsRef,
        //   where('userId', '==', userId),
        //   where('date', '>=', startDate),
        //   where('date', '<=', endDate),
        //   where('amount', '<', 0)
        // );

        // if (accountId) {
        //   queryRef = query(queryRef, where('accountId', '==', accountId));
        // }

        // const snapshot = await getDocs(queryRef);
        const categoryMap = new Map<string, number>();

        unsubscribe.forEach(data => {
          // const data = doc.data();
          const categoryId = data.categoryId;
          const amount = Math.abs(data.amount);
          categoryMap.set(categoryId, (categoryMap.get(categoryId) || 0) + amount);
        });

        const categoriesArray = [];
        // for (let [categoryId, value] of categoryMap.entries()) {
        //   // const categoryDoc = await getDoc(doc(db, 'categories', categoryId));
        //   // if (categoryDoc.exists()) {
        //   //   categoriesArray.push({
        //   //     name: categoryDoc.data().name,
        //   //     value,
        //   //   });
        //   // }
        // }

        categoriesArray.sort((a, b) => b.value - a.value);

        const topCategories = categoriesArray.slice(0, 3);
        const otherCategories = categoriesArray.slice(3);
        const otherSum = otherCategories.reduce((sum, current) => sum + current.value, 0);

        if (otherCategories.length > 0) {
          topCategories.push({ 
            name: "Other",
            value: otherSum,
          });
        }

        return topCategories;
      }

      const finalCategories = await fetchCategoryData(auth.userId, startDate, endDate);

      async function fetchActiveDays(
        userId: string,
        startDate: Date,
        endDate: Date,
      ) {
      const unsubscribe = await steamTransactionsListNew('pride')

        // const transactionsRef = collection(db, 'transactions');
        // let queryRef = query(
        //   transactionsRef,
        //   where('userId', '==', userId),
        //   where('date', '>=', startDate),
        //   where('date', '<=', endDate)
        // );

        // if (accountId) {
        //   queryRef = query(queryRef, where('accountId', '==', accountId));
        // }

        // const snapshot = await getDocs(queryRef);
        const daysMap = new Map<string, { income: number, expenses: number }>();

        unsubscribe.forEach(data => {
          // const data = doc.data();
          const date = data.date.toDate().toISOString().split('T')[0];
          const amount = data.amount;

          if (!daysMap.has(date)) {
            daysMap.set(date, { income: 0, expenses: 0 });
          }

          const day = daysMap.get(date);
          if (amount >= 0) {
            day.income += amount;
          } else {
            day.expenses += Math.abs(amount);
          }
        });

        return Array.from(daysMap.entries()).map(([date, { income, expenses }]) => ({
          date,
          income,
          expenses,
        }));
      }

      const activeDays = await fetchActiveDays(auth.userId, startDate, endDate);

      const days = fillMissingDays(
        activeDays,
        startDate,
        endDate,
      );

      return c.json({
        data: {
          remainingAmount: currentPeriod.remaining,
          remainingChange,
          incomeAmount: currentPeriod.income,
          incomeChange,
          expensesAmount: currentPeriod.expenses,
          expensesChange,
          categories: finalCategories,
          days,
        },
      });
    },
  );
