import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.events[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.events[":id"]["$patch"]>["json"];

export const useEditEvent = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.events[":id"]["$patch"]({ 
        param: { id },
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Event updated");
      queryClient.invalidateQueries({ queryKey: ["event", { id }] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to edit event");
    },
  });

  return mutation;
};
