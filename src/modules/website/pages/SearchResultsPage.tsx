import { SearchResultsGrid } from "../components/search/SearchResultsGrid";
import { SearchResultsHeader } from "../components/search/SearchResultsHeader";
import { SearchFiltersSidebar } from "../components/search/Sidebar";

export default function SearchResultsPage() {
  return (
    <section className="max-w-[1480px] mx-auto px-4 py-8">
      {/* Header */}
      <SearchResultsHeader />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 mt-6">
        {/* Sidebar */}
        <SearchFiltersSidebar />

        {/* Results */}
        <SearchResultsGrid />
      </div>
    </section>
  );
}
