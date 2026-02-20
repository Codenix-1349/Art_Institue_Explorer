import type { GalleryItem } from "../storage/gallery";
import { ArtworkCard } from "./ArtworkCard";

type Props = {
  items: GalleryItem[];
  onRemove: (artworkId: number) => void;
  onUpdateNote: (artworkId: number, note: string) => void;
};

export function Gallery({ items, onRemove, onUpdateNote }: Props) {
  return (
    <section>
      <h2>My Gallery</h2>

      {items.length === 0 ? (
        <p>No saved artworks yet. Add some from search results.</p>
      ) : null}

      <div>
        {items.map((it) => (
          <ArtworkCard
            key={it.artwork.id}
            artwork={it.artwork}
            noteSlot={
              <div>
                <label>
                  <span>Note (max 200 chars)</span>
                </label>
                <textarea
                  value={it.note}
                  onChange={(e) => onUpdateNote(it.artwork.id, e.target.value)}
                  rows={3}
                  placeholder="Write a short note..."
                />
              </div>
            }
            actionSlot={
              <button onClick={() => onRemove(it.artwork.id)}>Remove</button>
            }
          />
        ))}
      </div>
    </section>
  );
}
