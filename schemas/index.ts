import * as z from "zod";

export const channelsSchema = z.object({
  name: z.string().refine((data) => data !== "general", {
    message: "Name cannot be 'general",
  }),
  type: z.string(),
});

export const memberSchema = z.object({
  role: z.string(),
});

export const userSchema = z.object({
  name: z.string(),
  imageUrl: z.string().url(),
});
