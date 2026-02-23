import type { GalleryItem } from "../storage/gallery";
import { ArtworkCard } from "./ArtworkCard";

type Props = {
  items: GalleryItem[];
  onRemove: (artworkId: number) => void;
  onUpdateNote: (artworkId: number, note: string) => void;
  onBackToSearch: () => void;
};

export function Gallery({
  items,
  onRemove,
  onUpdateNote,
  onBackToSearch,
}: Props) {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-bold">My Gallery</h2>
          <p className="text-sm text-base-content/70">
            Your saved artworks (localStorage) + notes.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onBackToSearch}
        >
          ← Back to Search
        </button>
      </div>

      {items.length === 0 ? (
        <div className="alert">
          <span>No saved artworks yet. Add some from search results.</span>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <ArtworkCard
            key={it.artwork.id}
            artwork={it.artwork}
            noteSlot={
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-sm">
                    Note (max 200 chars)
                  </span>
                </label>

                <textarea
                  className="textarea textarea-bordered"
                  value={it.note}
                  rows={3}
                  placeholder="Write a short note..."
                  onKeyDown={(e) => {
                    e.stopPropagation();
                  }}
                  onKeyUp={(e) => {
                    e.stopPropagation();
                  }}
                  onChange={(e) => onUpdateNote(it.artwork.id, e.target.value)}
                />
              </div>
            }
            actionSlot={
              <button
                type="button"
                className="btn btn-outline btn-error btn-sm"
                onClick={() => onRemove(it.artwork.id)}
              >
                Remove
              </button>
            }
          />
        ))}
      </div>
    </section>
  );
}
