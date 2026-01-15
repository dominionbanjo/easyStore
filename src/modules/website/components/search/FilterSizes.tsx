export function FilterSizes() {
  const sizes = ["S", "M", "L", "XL"];

  return (
    <div>
      <h4 className="font-medium mb-3">Size</h4>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => (
          <button key={s} className="px-3 py-1 border rounded-full text-sm">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
