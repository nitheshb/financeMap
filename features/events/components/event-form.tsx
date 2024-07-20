// import { z } from "zod";
// import { Trash } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { insertEventSchema } from "@/db/schema"; // Updated import for events
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// const formSchema = insertEventSchema.pick({
//   title: true, // Adjusted to match event schema
// });

// type FormValues = z.input<typeof formSchema>;

// type Props = {
//   id?: string;
//   defaultValues?: FormValues;
//   onSubmit: (values: FormValues) => void;
//   onDelete?: () => void;
//   disabled?: boolean;
// };

// export const EventForm = ({
//   id,
//   defaultValues,
//   onSubmit,
//   onDelete,
//   disabled,
// }: Props) => {
//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: defaultValues,
//   });

//   const handleSubmit = (values: FormValues) => {
//     onSubmit(values);
//   };

//   const handleDelete = () => {
//     onDelete?.();
//   };
  
//   return (
//     <Form {...form}>
//       <form 
//         onSubmit={form.handleSubmit(handleSubmit)} 
//         className="space-y-4 pt-4"
//       >
//         <FormField
//           name="title" // Adjusted field name for event
//           control={form.control}
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>
//                 Title
//               </FormLabel>
//               <FormControl>
//                 <Input
//                   disabled={disabled}
//                   placeholder="e.g. Meeting, Conference, Workshop"
//                   {...field}
//                 />
//               </FormControl>
//             </FormItem>
//           )}
//         />
//         <Button className="w-full" disabled={disabled}>
//           {id ? "Save changes" : "Create event"} {/* Updated text */}
//         </Button>
//         {!!id && (
//           <Button
//             type="button"
//             disabled={disabled}
//             onClick={handleDelete}
//             className="w-full"
//             variant="outline"
//           >
//             <Trash className="size-4 mr-2" />
//             Delete event {/* Updated text */}
//           </Button>
//         )}
//       </form>
//     </Form>
//   )
// };




import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertEventSchema } from "@/db/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define the form schema with all required fields
const formSchema = insertEventSchema.pick({
  title: true,
  description: true,
  date: true,
  location: true,
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export const EventForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Event title"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Event description"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Event date"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="location"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Event location"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled}>
          {id ? "Save changes" : "Create event"}
        </Button>
        {!!id && onDelete && (
          <Button
            type="button"
            disabled={disabled}
            onClick={onDelete}
            className="w-full"
            variant="outline"
          >
            Delete event
          </Button>
        )}
      </form>
    </Form>
  );
};
