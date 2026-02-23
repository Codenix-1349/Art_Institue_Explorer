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

export function Search({ galleryItems, onAddToGallery, onGoToGallery }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Featured (Landing) preview
  const [featured, setFeatured] = useState<Artwork[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
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

  // Load featured once
  useEffect(() => {
    let cancelled = false;

    async function loadFeatured() {
      setFeaturedLoading(true);
      try {
        const data = await searchArtworks("monet", 12);
        const withImages = data.filter((a) => Boolean(a.image_id));

        if (!cancelled) {
          setFeatured(withImages);
          setFeaturedIndex(0);
          setFadeIn(true);
        }
      } catch {
        if (!cancelled) setFeatured([]);
      } finally {
        if (!cancelled) setFeaturedLoading(false);
      }
    }

    if (featured.length === 0) loadFeatured();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-rotate featured (fade transition)
  useEffect(() => {
    const onLanding = query.trim() === "" && results.length === 0 && !loading;

    if (!onLanding) {
      if (rotateTimer.current) window.clearInterval(rotateTimer.current);
      rotateTimer.current = null;
      return;
    }

    if (featured.length < 2) return;

    if (rotateTimer.current) window.clearInterval(rotateTimer.current);

    rotateTimer.current = window.setInterval(() => {
      setFadeIn(false);

      window.setTimeout(() => {
        setFeaturedIndex((i) => (i + 1) % featured.length);
        setFadeIn(true);
      }, 220);
    }, 4500);

    return () => {
      if (rotateTimer.current) window.clearInterval(rotateTimer.current);
      rotateTimer.current = null;
    };
  }, [featured.length, query, results.length, loading]);

  const showLanding = query.trim() === "" && results.length === 0 && !loading;
  const featuredArt =
    featured.length > 0 ? featured[featuredIndex % featured.length] : null;

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
                </div>

                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setFeaturedLoading(true);
                    searchArtworks("monet", 12)
                      .then((data) => data.filter((a) => Boolean(a.image_id)))
                      .then((data) => {
                        setFeatured(data);
                        setFeaturedIndex(0);
                        setFadeIn(true);
                      })
                      .finally(() => setFeaturedLoading(false));
                  }}
                  title="Refresh preview"
                >
                  Refresh
                </button>
              </div>

              {/* Image */}
              <div
                className={`
                  transition-opacity duration-300
                  ${fadeIn ? "opacity-100" : "opacity-0"}
                `}
              >
                <div className="overflow-hidden rounded-2xl shadow-lg border border-base-300 bg-base-200">
                  <img
                    className="w-full object-cover"
                    src={`https://www.artic.edu/iiif/2/${featuredArt.image_id}/full/1200,/0/default.jpg`}
                    alt={featuredArt.title}
                    loading="lazy"
                  />
                </div>
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
