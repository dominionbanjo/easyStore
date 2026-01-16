type Category = {
  id: string;
  name: string;
};

type Props = {
  categories: Category[];
  onSelect: (category: Category) => void;
};

export function StoreCategoriesGrid({ categories, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat)}
          className="rounded-xl border bg-white p-6 text-center hover:shadow-md transition"
        >
          <p className="font-semibold text-foreground">{cat.name}</p>
        </button>
      ))}
    </div>
  );
}
