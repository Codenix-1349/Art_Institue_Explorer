import { z } from "zod";
import { ArtworkSchema, type Artwork } from "../schemas/artwork";

/**
 * Art Institute of Chicago API base URL
 */
const AIC_BASE = "https://api.artic.edu/api/v1";

const SearchResponseSchema = z.object({
  data: z.array(ArtworkSchema),
});

export function buildIiifImageUrl(
  imageId: string,
  width: 843 | 400 | 200 = 843,
): string {
  return `https://www.artic.edu/iiif/2/${imageId}/full/${width},/0/default.jpg`;
}

export async function searchArtworks(
  query: string,
  limit = 24,
): Promise<Artwork[]> {
  const q = query.trim();
  if (!q) return [];

  const url = new URL(`${AIC_BASE}/artworks/search`);
  url.searchParams.set("q", q);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("fields", "id,title,artist_title,image_id");

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`AIC request failed (${res.status})`);
  }

  const json = await res.json();

  // Validate with Zod (reject invalid response shape)
  const parsed = SearchResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Invalid API response shape (Zod validation failed).");
  }

  return parsed.data.data;
}
