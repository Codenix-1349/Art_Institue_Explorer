import { z } from "zod";
import { ArtworkSchema, type Artwork } from "../schemas/artwork";
import { NoteSchema } from "../schemas/note";

const STORAGE_KEY = "aic_gallery_v1";

const GalleryItemSchema = z.object({
  artwork: ArtworkSchema,
  note: NoteSchema,
});

export type GalleryItem = z.infer<typeof GalleryItemSchema>;

const GallerySchema = z.array(GalleryItemSchema);

export function loadGallery(): GalleryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const json = JSON.parse(raw);
    const parsed = GallerySchema.safeParse(json);
    if (!parsed.success) return [];

    return parsed.data;
  } catch {
    return [];
  }
}

function saveGallery(items: GalleryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addToGallery(
  items: GalleryItem[],
  artwork: Artwork,
): GalleryItem[] {
  if (items.some((it) => it.artwork.id === artwork.id)) return items;

  const next: GalleryItem[] = [{ artwork, note: "" }, ...items];
  saveGallery(next);
  return next;
}

export function removeFromGallery(
  items: GalleryItem[],
  artworkId: number,
): GalleryItem[] {
  const next = items.filter((it) => it.artwork.id !== artworkId);
  saveGallery(next);
  return next;
}

export function updateNote(
  items: GalleryItem[],
  artworkId: number,
  note: string,
): GalleryItem[] {
  const safeNote = NoteSchema.parse(note);

  const next = items.map((it) =>
    it.artwork.id === artworkId ? { ...it, note: safeNote } : it,
  );

  saveGallery(next);
  return next;
}
