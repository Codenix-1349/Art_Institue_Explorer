import { z } from "zod";

export const NoteSchema = z
  .string()
  .trim()
  .max(200, "Max 200 characters")
  .catch("");

export type Note = z.infer<typeof NoteSchema>;
