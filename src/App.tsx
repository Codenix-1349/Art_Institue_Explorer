import { useState } from "react";
import { Search } from "./components/Search";
import { Gallery } from "./components/Gallery";
import type { Artwork } from "./schemas/artwork";
import {
  addToGallery,
  loadGallery,
  removeFromGallery,
  updateNote,
  type GalleryItem,
} from "./storage/gallery";

export default function App() {
  const [activeView, setActiveView] = useState<"search" | "gallery">("search");
  const [gallery, setGallery] = useState<GalleryItem[]>(() => loadGallery());

  function goHome() {
    setActiveView("search");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleAdd(artwork: Artwork) {
    setGallery((prev) => addToGallery(prev, artwork));
    setActiveView("gallery"); // optional: after save jump to gallery
  }

  function handleRemove(artworkId: number) {
    setGallery((prev) => removeFromGallery(prev, artworkId));
  }

  function handleUpdateNote(artworkId: number, note: string) {
    setGallery((prev) => updateNote(prev, artworkId, note));
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        <header className="space-y-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              {/* ✅ Title as "home" link */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  goHome();
                }}
                className="inline-block"
                title="Back to Search"
              >
                <h1 className="text-3xl font-extrabold tracking-tight hover:underline underline-offset-4">
                  Art Institute Explorer
                </h1>
              </a>

              <p className="text-base-content/70">
                Search AIC collection, save favourites, add notes.
              </p>
            </div>

            {/* ✅ Keep only this counter (right side) */}
            <div className="stats shadow bg-base-100 border border-base-300">
              <div className="stat py-3">
                <div className="stat-title">Saved</div>
                <div className="stat-value text-2xl">{gallery.length}</div>
                <div className="stat-desc">localStorage</div>
              </div>
            </div>
          </div>
        </header>

        <main className="bg-base-100 border border-base-300 rounded-2xl shadow-sm p-4 md:p-6">
          {activeView === "search" ? (
            <Search
              galleryItems={gallery}
              onAddToGallery={handleAdd}
              onGoToGallery={() => setActiveView("gallery")}
            />
          ) : (
            <Gallery
              items={gallery}
              onRemove={handleRemove}
              onUpdateNote={handleUpdateNote}
              onBackToSearch={goHome}
            />
          )}
        </main>

        <footer className="text-sm text-base-content/60 px-1 pb-6">
          Data via Art Institute of Chicago API. Images served via IIIF.
        </footer>
      </div>
    </div>
  );
}
