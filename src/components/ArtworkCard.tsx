import type { Artwork } from "../schemas/artwork";
import { buildIiifImageUrl } from "../api/aic";

type Props = {
  artwork: Artwork;
  actionSlot?: React.ReactNode;
  noteSlot?: React.ReactNode;
};

export function ArtworkCard({ artwork, actionSlot, noteSlot }: Props) {
  const hasImage = Boolean(artwork.image_id);
  const imageUrl = hasImage ? buildIiifImageUrl(artwork.image_id!, 400) : null;

  return (
    <div
      className="
        card bg-base-100 border border-base-300 shadow-sm overflow-hidden
        transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-lg hover:border-base-content/20
      "
    >
      <figure className="aspect-[4/3] bg-base-200">
        {imageUrl ? (
          <img
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            src={imageUrl}
            alt={artwork.title}
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-base-content/60">
            No Image
          </div>
        )}
      </figure>

      <div className="card-body gap-3">
        <div className="space-y-1">
          <h3 className="card-title text-base md:text-lg leading-tight">
            {artwork.title}
          </h3>
          <p className="text-sm text-base-content/70">{artwork.artist_title}</p>
        </div>

        {noteSlot ? <div>{noteSlot}</div> : null}
        {actionSlot ? (
          <div className="card-actions justify-end">{actionSlot}</div>
        ) : null}
      </div>
    </div>
  );
}
