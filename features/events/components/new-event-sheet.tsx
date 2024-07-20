import { z } from "zod";
import { useNewEvent } from "@/features/events/hooks/use-new-event"; 
import { EventForm } from "@/features/events/components/event-form"; 
import { useCreateEvent } from "@/features/events/api/use-create-event"; 

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

interface NewEventSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewEventSheet = ({ isOpen, onClose }: NewEventSheetProps) => {
  const mutation = useCreateEvent(); 

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>
            New Event 
          </SheetTitle>
          <SheetDescription>
            Create a new event to track your activities. 
          </SheetDescription>
        </SheetHeader>
        <EventForm
          onSubmit={onSubmit} 
          disabled={mutation.isPending}
          defaultValues={{
            title: "",
            description: "",
            date: "",
            location: "",
          }} 
        />
      </SheetContent>
    </Sheet>
  );
};



