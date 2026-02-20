import { useState } from "react";
import type { Artwork } from "../schemas/artwork";
import { searchArtworks } from "../api/aic";
import { ArtworkCard } from "./ArtworkCard";

export function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runSearch(q: string) {
    const cleaned = q.trim();
    if (!cleaned) return;

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

  return (
    <section>
      <h2>Search</h2>

      <form onSubmit={onSubmit}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Try "monet", "cats", ...'
          aria-label="Search artworks"
          autoComplete="off"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
      </form>

      {error ? <p>Error: {error}</p> : null}

      <div>
        {results.map((art) => (
          <ArtworkCard key={art.id} artwork={art} />
        ))}
      </div>
    </section>
  );
}
