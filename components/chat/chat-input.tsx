"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useForm } from "react-hook-form";
import * as z from "zod";

import EmojiPicker from "@/components/emoji-picker";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/store";

interface Props {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

export default function ChatInput({ apiUrl, type, query, name }: Props) {
  const { onOpen } = useModal();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      return axios.post(url, values);
    },
    onSuccess: () => {
      form.reset();
      router.refresh();
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutate(data))}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    {...field}
                    disabled={isLoading}
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={`Message ${
                      type === "conversation" ? name : "#" + name
                    }`}
                  />
                  <div className="absolute top-7 right-8">
                    <EmojiPicker
                      onChange={(emoji) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
