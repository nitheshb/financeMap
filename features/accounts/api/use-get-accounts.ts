import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { fetchPrideStalls } from "@/db/dbQueryFirebase";

export const useGetAccounts = () => {
  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const response = await client.api.accounts.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

export const useGetPrideStalls = () => {
  const query = useQuery({
    queryKey: ["pride_stall"],
    queryFn: fetchPrideStalls,
    // This option ensures that the query remains active and receives real-time updates
    // refetchInterval: false,
    // refetchIntervalInBackground: false,
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
  });

  return query;
};
function setLeadsFetchedData(usersListA: any) {
  throw new Error("Function not implemented.");
}

