import { Search } from "./components/Search";

export default function App() {
  return (
    <div>
      <h1>Art Institute Explorer</h1>

      <p>Search the Art Institute of Chicago collection.</p>

      <div>
        <Search />
      </div>

      <footer>
        Data via Art Institute of Chicago API. Images served via IIIF.
      </footer>
    </div>
  );
}
