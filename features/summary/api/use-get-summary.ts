import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";
import { steamTransactionsList, steamTransactionsListNew } from "@/db/dbQueryFirebase";

export const useGetSummary = () => {
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    queryKey: ["summary", { from, to, accountId }],
    queryFn: async () => {
      const response = await client.api.summary.$get({
        query: {
          from,
          to,
          accountId,
        },
      });
     

      const unsubscribe = await steamTransactionsListNew('pride')
     
      console.log('unsubscribe is', await unsubscribe)
          // return unsubscribe;
          await  console.log('unsubscribe is', await unsubscribe)
          
        
 
    //   const unsubscribe = await steamTransactionsList(
    //     'pride',
    //     (querySnapshot:any) => {
    //       const usersListA = querySnapshot.docs.map((docSnapshot:any) =>
    //         docSnapshot.data()
    //       )
    //       console.log('fetched details are', usersListA)
       
          
    //       return usersListA
    //     },
    //     () => ([])
    //   )
    
    //  await  console.log('unsubscribe is', unsubscribe.data())

      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }

      const { data } = await response.json();
      const x = await unsubscribe
    await  console.log('response is',x, { ...data,
      incomeAmount: convertAmountFromMiliunits(data.incomeAmount),
      expensesAmount: convertAmountFromMiliunits(data.expensesAmount),
      remainingAmount: convertAmountFromMiliunits(data.remainingAmount),
      categories: data.categories.map((category) => ({
        ...category,
        value: convertAmountFromMiliunits(category.value),
      })),
      days: data.days.map((day) => ({
        ...day,
        income: convertAmountFromMiliunits(day.income),
        expenses: convertAmountFromMiliunits(day.expenses),
      }))})

      return {
        ...data,
        incomeAmount: convertAmountFromMiliunits(data.incomeAmount),
        expensesAmount: convertAmountFromMiliunits(data.expensesAmount),
        remainingAmount: convertAmountFromMiliunits(data.remainingAmount),
        categories: data.categories.map((category) => ({
          ...category,
          value: convertAmountFromMiliunits(category.value),
        })),
        days: data.days.map((day) => ({
          ...day,
          income: convertAmountFromMiliunits(day.income),
          expenses: convertAmountFromMiliunits(day.expenses),
        }))
      }
    },
  });

  return query;
};
