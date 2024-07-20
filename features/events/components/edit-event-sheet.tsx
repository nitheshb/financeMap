import { z } from "zod";
import { Loader2 } from "lucide-react";

import { useGetEvent } from "@/features/events/api/use-get-event";
import { EventForm } from "@/features/events/components/event-form";
import { useOpenEvent } from "@/features/events/hooks/use-open-event";
import { useEditEvent } from "@/features/events/api/use-edit-event";
import { useDeleteEvent } from "@/features/events/api/use-delete-event";

import { useConfirm } from "@/hooks/use-confirm";
import { insertEventSchema } from "@/db/schema";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";


const formSchema = insertEventSchema.pick({
  title: true,
  description: true,
  date: true,
  location: true,
});

type FormValues = z.infer<typeof formSchema>;


interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  userId: string;
}

export const EditEventSheet = () => {
  const { isOpen, onClose, id } = useOpenEvent();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this event."
  );

  const eventQuery = useGetEvent(id);

  
  const event = eventQuery.data as Event | undefined;

  const editMutation = useEditEvent(id);
  const deleteMutation = useDeleteEvent(id);

  const isPending =
    editMutation.isPending ||
    deleteMutation.isPending;

  const isLoading = eventQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        }
      });
    }
  };

  const defaultValues: FormValues = event ? {
    title: event.title,
    description: event.description,
    date: event.date,
    location: event.location,
  
  } : {
    title: "",
    description: "",
    date: "",
    location: "",
   
  };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>
              Edit Event
            </SheetTitle>
            <SheetDescription>
              Edit an existing event
            </SheetDescription>
          </SheetHeader>
          {isLoading
            ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="size-4 text-muted-foreground animate-spin" />
              </div>
            ) : (
              <EventForm
                id={id}
                onSubmit={onSubmit} 
                disabled={isPending}
                defaultValues={defaultValues}
                onDelete={onDelete}
              />
            )
          }
        </SheetContent>
      </Sheet>
    </>
  );
};
