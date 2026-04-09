export function FilterColors() {
  const colors = ["black", "white", "red", "blue"];

  return (
    <div>
      <h4 className="font-medium mb-3">Color</h4>
      <div className="flex flex-wrap gap-2">
        {colors.map((c) => (
          <button
            key={c}
            className="w-7 h-7 rounded-sm border"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );
}
