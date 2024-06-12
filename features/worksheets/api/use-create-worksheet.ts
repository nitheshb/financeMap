import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.worksheets.$post>;
type RequestType = InferRequestType<typeof client.api.worksheets.$post>["json"];

export const useCreateWorksheet = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.worksheets.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Worksheet created");
      queryClient.invalidateQueries({ queryKey: ["worksheets"] });
    },
    onError: () => {
      toast.error("Failed to create worksheet");
    },
  });

  return mutation;
};
