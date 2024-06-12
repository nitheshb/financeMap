import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetWorksheets = () => {
  const query = useQuery({
    queryKey: ["worksheets"], // Unique key for caching
    queryFn: async () => {
      const response = await client.api.worksheets.$get(); // Assuming this is the endpoint to fetch worksheets

      if (!response.ok) {
        throw new Error("Failed to fetch worksheets");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
