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
    <div>
      <div>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={artwork.title}
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div>No Image</div>
        )}
      </div>

      <div>
        <h3>{artwork.title}</h3>
        <p>{artwork.artist_title}</p>

        {noteSlot ? <div>{noteSlot}</div> : null}
        {actionSlot ? <div>{actionSlot}</div> : null}
      </div>
    </div>
  );
}
