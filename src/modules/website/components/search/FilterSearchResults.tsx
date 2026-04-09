export function SearchResultsHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        Showing results for <strong>"tablet"</strong>
      </p>

      <select className="border rounded-sm px-4 py-2 text-sm">
        <option>Featured</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
        <option>Best Rating</option>
        <option>Newest</option>
      </select>
    </div>
  );
}
