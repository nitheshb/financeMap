import { useRef, useState } from "react";

import { useGetEvents } from "@/features/events/api/use-get-events"; // Updated import for events
import { useCreateEvent } from "@/features/events/api/use-create-event"; // Updated import for events

import { Select } from "@/components/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

export const useSelectEvent = (): [() => JSX.Element, () => Promise<unknown>] => {
  const eventQuery = useGetEvents(); 
  const eventMutation = useCreateEvent(); 

  const onCreateEvent = (title: string) => eventMutation.mutate({
    title ,
    date: "",
    description: "",
    location: ""
  });

  const eventOptions = (eventQuery.data ?? []).map((event) => ({
    label: event.title,
    value: event.id,
  }));

  const [promise, setPromise] = useState<{ 
    resolve: (value: string | undefined) => void 
  } | null>(null);
  const selectValue = useRef<string>();

  const confirm = () => new Promise((resolve, reject) => {
    setPromise({ resolve });
  });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(selectValue.current);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(undefined);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Select Event
          </DialogTitle>
          <DialogDescription>
            Please select an event to continue.
          </DialogDescription>
        </DialogHeader>
        <Select
          placeholder="Select an event"
          options={eventOptions}
          onCreate={onCreateEvent}
          onChange={(value) => selectValue.current = value}
          disabled={eventQuery.isLoading || eventMutation.isPending}
        />
        <DialogFooter className="pt-2">
          <Button
            onClick={handleCancel}
            variant="outline"
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirm];
};
