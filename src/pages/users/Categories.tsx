import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Categories() {
  const categories = [
    {
      id: 1,
      title: "Fashion",
      desc: "Trendy clothing, footwear, and accessories for all styles.",
      image:
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
    },
    {
      id: 2,
      title: "Electronics",
      desc: "Smartphones, gadgets, and everything tech.",
      image:
        "https://images.unsplash.com/photo-1510557880182-3d4d3c0bafd0?w=800",
    },
    {
      id: 3,
      title: "Home & Living",
      desc: "Essentials to make your home cozy and modern.",
      image:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800",
    },
  ];

  return (
    <>
      <main className="max-w-6xl mx-auto px-6 py-16 space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Shop by Category</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Explore products tailored to your interests — from style and gadgets
            to home essentials.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map((c) => (
            <Card
              key={c.id}
              className="overflow-hidden hover:shadow-md transition-all cursor-pointer group"
            >
              <div
                className="h-56 bg-cover bg-center group-hover:scale-105 transition-transform"
                style={{ backgroundImage: `url(${c.image})` }}
              />
              <CardHeader>
                <CardTitle className="text-lg">{c.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{c.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
