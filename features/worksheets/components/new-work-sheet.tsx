import { z } from "zod";
import { Loader2 } from "lucide-react";
import { WorksheetForm } from "@/features/worksheets/components/worksheet-form";
import { useNewWorksheet } from "@/features/worksheets/hooks/use-new-worksheet";
import { useCreateWorksheet } from "@/features/worksheets/api/use-create-worksheet";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const formSchema = z.object({
  title: z.string().nonempty("Worksheet name is required"),
  address: z.string().nonempty("Address is required"),
  amount: z.number().nonnegative("Amount must be a positive number"),
  pillarsCount: z.number().nonnegative("Pillars count must be a positive number"),
  beamsCount: z.number().nonnegative("Beams count must be a positive number"),
  chainPulleys: z.enum(["yes", "no"]),
});

type FormValues = z.input<typeof formSchema>;

export const NewWorksheetSheet = () => {
  const { isOpen, onClose } = useNewWorksheet();
  const createMutation = useCreateWorksheet();

  const isPending = createMutation.isPending;
  const isLoading = false; 

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Worksheet</SheetTitle>
          <SheetDescription>Add a new worksheet</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <WorksheetForm onSubmit={onSubmit} disabled={isPending} />
        )}
      </SheetContent>
    </Sheet>
  );
};
