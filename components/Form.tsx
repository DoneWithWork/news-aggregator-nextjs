"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { SetUserPreferences } from "@/app/actions/userPreferences";
import { useFormStatus } from "react-dom";

const items = [
  {
    id: "general",
    label: "General News",
  },
  {
    id: "business",
    label: "Business News",
  },
  {
    id: "entertainment",
    label: "Entertainment News",
  },
  {
    id: "health",
    label: "Health News",
  },
  {
    id: "science",
    label: "Science News",
  },
  {
    id: "sports",
    label: "Sports News",
  },
  {
    id: "technology",
    label: "Technology News",
  },
] as const;

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

export function PreferenceForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: ["general", "technology"],
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    const formData = new FormData();
    data.items.forEach((item) => formData.append("items", item));

    const result = await SetUserPreferences(formData);

    if (result) {
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
        });
      } else {
        toast({
          title: "Success",
          description: result.message,
        });
      }
    }
  }

  return (
    <div className="bg-white/40 h-full w-screen fixed z-10">
      <div className="space-y-8   mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1f1f1f] w-[80%] max-w-[700px] text-white font-semibold rounded-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[80%]  mx-auto py-10"
          >
            <FormField
              control={form.control}
              name="items"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className=" font-bold text-2xl">
                      Select Topics to Follow
                    </FormLabel>
                  </div>
                  {items.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="items"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                className={`${
                                  field.value?.includes(item.id)
                                    ? "bg-[#2f2f2f]"
                                    : "bg-[#1f1f1f]"
                                } rounded-md border border-[#2f2f2f] w-6 h-6`}
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-lg  font-semibold">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton />
          </form>
        </Form>
      </div>
    </div>
  );
}
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="my-5" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </Button>
  );
}
