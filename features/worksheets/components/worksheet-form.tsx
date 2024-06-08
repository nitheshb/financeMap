import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  title: z.string().nonempty("Worksheet name is required"),
  address: z.string().nonempty("Address is required"),
  amount: z.number().nonnegative("Amount must be a positive number"),
  pillarsCount: z.number().nonnegative("Pillars count must be a positive number"),
  beamsCount: z.number().nonnegative("Beams count must be a positive number"),
  chainPulleys: z.enum(["yes", "no"]).refine(val => val === "yes" || val === "no", {
    message: "Chain pulleys must be 'yes' or 'no'",
  }),
});

type FormValues = z.input<typeof formSchema>;

interface WorksheetFormProps {
  onSubmit: (values: FormValues) => void;
  disabled: boolean;
}

export const WorksheetForm: React.FC<WorksheetFormProps> = ({ onSubmit, disabled }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
        <FormField
          name="title"
          control={form.control}
          render={({ field }: ControllerRenderProps<FormValues, "title">) => (
            <FormItem>
              <FormLabel>Worksheet Name</FormLabel>
              <FormControl>
                <Input disabled={disabled} placeholder="Worksheet name" {...field} />
              </FormControl>
              <FormMessage>{field.error?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          name="address"
          control={form.control}
          render={({ field }: ControllerRenderProps<FormValues, "address">) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input disabled={disabled} placeholder="Address" {...field} />
              </FormControl>
              <FormMessage>{field.error?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          name="amount"
          control={form.control}
          render={({ field }: ControllerRenderProps<FormValues, "amount">) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" disabled={disabled} placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage>{field.error?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          name="pillarsCount"
          control={form.control}
          render={({ field }: ControllerRenderProps<FormValues, "pillarsCount">) => (
            <FormItem>
              <FormLabel>Pillars Count</FormLabel>
              <FormControl>
                <Input type="number" disabled={disabled} placeholder="Pillars count" {...field} />
              </FormControl>
              <FormMessage>{field.error?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          name="beamsCount"
          control={form.control}
          render={({ field }: ControllerRenderProps<FormValues, "beamsCount">) => (
            <FormItem>
              <FormLabel>Beams Count</FormLabel>
              <FormControl>
                <Input type="number" disabled={disabled} placeholder="Beams count" {...field} />
              </FormControl>
              <FormMessage>{field.error?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          name="chainPulleys"
          control={form.control}
          render={({ field }: ControllerRenderProps<FormValues, "chainPulleys">) => (
            <FormItem>
              <FormLabel>Chain Pulleys</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select an option"
                  options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage>{field.error?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};
