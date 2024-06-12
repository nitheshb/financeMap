import React, { useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { WorksheetForm } from "@/features/worksheets/components/worksheet-form";
import { useNewWorksheet } from "@/features/worksheets/hooks/use-new-worksheet";
import { useCreateWorksheet } from "@/features/worksheets/api/use-create-worksheet";

import { insertWorksheetSchema } from "@/db/schema";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const formSchema = insertWorksheetSchema.omit({
  id: true,
});


type FormValues = z.input<typeof formSchema>;

export const NewWorksheetSheet = () => {
  const { isOpen, onClose } = useNewWorksheet();
  const [isCreating, setIsCreating] = useState(false); 
  const createMutation = useCreateWorksheet();

  
  const onSubmit = async (values: FormValues) => {
    setIsCreating(true); 
    try {
      
      const { amount = 0, pillarsCount = 0, beamsCount = 0, ...rest } = values;

    
      await createMutation.mutateAsync({
        ...rest,
        amount,
        pillarsCount,
        beamsCount,
      });
      onClose(); 
    } catch (error) {
      setIsCreating(false);
      console.error("Error creating worksheet:", error); 
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Worksheet</SheetTitle>
          <SheetDescription>Add a new worksheet</SheetDescription>
        </SheetHeader>
        {isCreating ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <WorksheetForm onSubmit={onSubmit} disabled={isCreating} />
        )}
      </SheetContent>
    </Sheet>
  );
};
