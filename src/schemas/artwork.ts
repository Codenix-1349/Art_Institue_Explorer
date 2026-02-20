import { z } from "zod";

export const ArtworkSchema = z
  .object({
    id: z.coerce.number().int(),
    title: z.string().catch("Untitled"),
    artist_title: z.string().catch("Unknown artist"),
    image_id: z.string().nullable().catch(null),
  })
  .passthrough();

export type Artwork = z.infer<typeof ArtworkSchema>;
