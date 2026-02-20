import { z } from "zod";
import { ArtworkSchema, type Artwork } from "../schemas/artwork";
import { NoteSchema, type Note } from "../schemas/note";

const STORAGE_KEY = "aic_gallery_v1";

export const GalleryItemSchema = z.object({
  artwork: ArtworkSchema,
  note: NoteSchema,
});

export type GalleryItem = z.infer<typeof GalleryItemSchema>;

const GallerySchema = z.array(GalleryItemSchema);

export function loadGallery(): GalleryItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const json = JSON.parse(raw);
    const parsed = GallerySchema.safeParse(json);
    if (!parsed.success) return [];
    return parsed.data;
  } catch {
    return [];
  }
}

export function saveGallery(items: GalleryItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function isInGallery(items: GalleryItem[], artworkId: number): boolean {
  return items.some((it) => it.artwork.id === artworkId);
}
