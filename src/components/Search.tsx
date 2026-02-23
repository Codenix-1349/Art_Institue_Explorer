import { useEffect, useMemo, useRef, useState } from "react";
import type { Artwork } from "../schemas/artwork";
import { searchArtworks } from "../api/aic";
import { ArtworkCard } from "./ArtworkCard";
import type { GalleryItem } from "../storage/gallery";

type Props = {
  galleryItems: GalleryItem[];
  onAddToGallery: (artwork: Artwork) => void;
  onGoToGallery: () => void;
};

const FEATURED_TOPICS = [
  "landscape",
  "portrait",
  "abstract",
  "sculpture",
  "impressionism",
  "renaissance",
  "modern art",
  "photography",
  "still life",
  "architecture",
  "mythology",
];

function getRandomTopic(exclude?: string) {
  if (FEATURED_TOPICS.length === 0) return "art";
  if (FEATURED_TOPICS.length === 1) return FEATURED_TOPICS[0];

  let topic =
    FEATURED_TOPICS[Math.floor(Math.random() * FEATURED_TOPICS.length)];
  if (exclude) {
    let guard = 0;
    while (topic === exclude && guard < 10) {
      topic =
        FEATURED_TOPICS[Math.floor(Math.random() * FEATURED_TOPICS.length)];
      guard++;
    }
  }
  return topic;
}

function iiifHeroUrl(imageId: string) {
  return `https://www.artic.edu/iiif/2/${imageId}/full/1200,/0/default.jpg`;
}

export function Search({ galleryItems, onAddToGallery, onGoToGallery }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Featured (Landing) preview
  const [featured, setFeatured] = useState<Artwork[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredTopic, setFeaturedTopic] = useState<string>("");

  // Crossfade state
  const [overlayArt, setOverlayArt] = useState<Artwork | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const rotateTimer = useRef<number | null>(null);

  const savedIds = useMemo(
    () => new Set(galleryItems.map((it) => it.artwork.id)),
    [galleryItems],
  );

  async function runSearch(q: string) {
    const cleaned = q.trim();
    if (!cleaned) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchArtworks(cleaned, 24);
      setResults(data);
    } catch (err) {
      setResults([]);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await runSearch(query);
  }

  async function loadFeatured(nextTopic?: string) {
    setFeaturedLoading(true);
    try {
      const topic = nextTopic ?? getRandomTopic(featuredTopic);
      const data = await searchArtworks(topic, 12);
      const withImages = data.filter((a) => Boolean(a.image_id));

      setFeaturedTopic(topic);
      setFeatured(withImages);
      setFeaturedIndex(0);

      // reset overlay when replacing list
      setOverlayArt(null);
      setOverlayVisible(false);
    } catch {
      setFeatured([]);
    } finally {
      setFeaturedLoading(false);
    }
  }

  // Load featured once
  useEffect(() => {
    if (featured.length === 0) {
      void loadFeatured(getRandomTopic());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showLanding = query.trim() === "" && results.length === 0 && !loading;
  const featuredArt =
    featured.length > 0 ? featured[featuredIndex % featured.length] : null;

  // Auto-rotate featured with CROSSFADE (no abrupt cut + no flicker)
  useEffect(() => {
    const onLanding = showLanding;

    if (!onLanding) {
      if (rotateTimer.current) window.clearInterval(rotateTimer.current);
      rotateTimer.current = null;
      return;
    }

    if (featured.length < 2) return;
    if (!featuredArt) return;

    if (rotateTimer.current) window.clearInterval(rotateTimer.current);

    rotateTimer.current = window.setInterval(() => {
      const next = featured[(featuredIndex + 1) % featured.length];
      if (!next?.image_id) return;

      // Start crossfade:
      setOverlayArt(next);
      setOverlayVisible(false);

      // Let React paint overlay at opacity 0 first
      window.setTimeout(() => {
        setOverlayVisible(true);

        // After fade duration, commit the swap
        window.setTimeout(() => {
          setFeaturedIndex((i) => (i + 1) % featured.length);
          setOverlayVisible(false);
          setOverlayArt(null);
        }, 320); // fade duration
      }, 20);
    }, 4500);

    return () => {
      if (rotateTimer.current) window.clearInterval(rotateTimer.current);
      rotateTimer.current = null;
    };
  }, [featured, featuredIndex, featuredArt, showLanding]);

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Search</h2>
          <p className="text-sm text-base-content/70">
            Find artworks and add them to your personal gallery.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onGoToGallery}
        >
          View Gallery{" "}
          <span className="ml-2 badge badge-neutral">
            {galleryItems.length}
          </span>
        </button>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
        <label className="input input-bordered flex items-center gap-2 w-full">
          <span className="opacity-60">🔎</span>
          <input
            className="grow"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Try "monet", "cats", ...'
            aria-label="Search artworks"
            autoComplete="off"
          />
        </label>

        <button
          className="btn btn-primary sm:min-w-36"
          type="submit"
          disabled={loading}
        >
          {loading ? <span className="loading loading-spinner" /> : null}
          Search
        </button>
      </form>

      {error ? (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : null}

      {/* Landing hero preview (smooth crossfade + fixed aspect ratio to prevent size jumps) */}
      {showLanding ? (
        featuredLoading ? (
          <div className="flex items-center gap-2 text-sm text-base-content/70">
            <span className="loading loading-spinner" /> Loading preview…
          </div>
        ) : featuredArt ? (
          <div className="flex justify-center">
            <div className="w-full max-w-3xl space-y-3">
              {/* Title + Artist ABOVE */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold leading-tight">
                    {featuredArt.title}
                  </h3>
                  <p className="text-sm text-base-content/70">
                    {featuredArt.artist_title}
                  </p>
                  {featuredTopic ? (
                    <p className="text-xs text-base-content/50">
                      Topic: {featuredTopic}
                    </p>
                  ) : null}
                </div>

                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    void loadFeatured(getRandomTopic(featuredTopic))
                  }
                  title="Refresh preview"
                  disabled={featuredLoading}
                >
                  Refresh
                </button>
              </div>

              {/* ✅ Fixed-size hero box prevents layout shift */}
              <div className="relative overflow-hidden rounded-2xl shadow-lg border border-base-300 bg-base-200 aspect-[16/9]">
                {/* Base image */}
                <img
                  className="absolute inset-0 w-full h-full object-cover"
                  src={iiifHeroUrl(featuredArt.image_id!)}
                  alt={featuredArt.title}
                  loading="lazy"
                  draggable={false}
                />

                {/* Overlay image fades in on top */}
                {overlayArt?.image_id ? (
                  <img
                    className={`
                      absolute inset-0 w-full h-full object-cover
                      transition-opacity duration-300
                      ${overlayVisible ? "opacity-100" : "opacity-0"}
                    `}
                    src={iiifHeroUrl(overlayArt.image_id)}
                    alt={overlayArt.title}
                    loading="lazy"
                    draggable={false}
                  />
                ) : null}
              </div>
            </div>
          </div>
        ) : null
      ) : null}

      {/* Results grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((art) => {
          const saved = savedIds.has(art.id);

          return (
            <ArtworkCard
              key={art.id}
              artwork={art}
              actionSlot={
                <button
                  type="button"
                  className={`btn btn-sm ${saved ? "btn-disabled" : "btn-secondary"}`}
                  onClick={() => onAddToGallery(art)}
                  disabled={saved}
                  title={saved ? "Already saved" : "Add to Gallery"}
                >
                  {saved ? "Saved" : "Add to Gallery"}
                </button>
              }
            />
          );
        })}
      </div>
    </section>
  );
}
