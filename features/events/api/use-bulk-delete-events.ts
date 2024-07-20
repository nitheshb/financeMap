import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.events["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.events["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteEvents = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.events["bulk-delete"]["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Events deleted");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      
    },
    onError: () => {
      toast.error("Failed to delete events");
    },
  });

  return mutation;
};
