// interface Brand {
//   name: string;
//   img: string;
// }

export default function FeaturedBrands() {
  // const brands: Brand[] = [
  //   { name: "Urban Threads", img: "/logos/company/fb.png" },
  //   { name: "Luxe Essentials", img: "/logos/company/ig.png" },
  //   { name: "FreshMart", img: "/logos/company/TKTK.png" },
  //   { name: "Glow Beauty", img: "/logos/company/re.png" },
  //   { name: "Style Hub", img: "/logos/company/ty.png" },
  //   { name: "Nova Wear", img: "/logos/company/ui.png" },
  //   { name: "Prime Picks", img: "/logos/company/qw.png" },
  //   { name: "Everyday Store", img: "/logos/company/yu.png" },
  // ];

  return (
    <section className="py-12 mt-5 bg-gradient-to-r from-[#17c06e] via-[#5ed49c] to-[#17c06e] border w-full rounded-xl">
      <div className="max-w-[1700px] mx-auto px-6">
        <div className="flex flex-col items-center justify-center gap-8">
          {/* Headline */}
          <p className="text-white font-semibold text-center text-lg md:text-xl leading-tight">
            Powering 40,000+ Stores & Growing Brands Worldwide
          </p>

          {/* Subtext */}
          <p className="text-white/90 text-center text-sm md:text-base max-w-2xl">
            From fashion and beauty to food and lifestyle, these brands trust
            EasyStore to run and scale their online businesses.
          </p>

          {/* Brand Logos */}
          {/* <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="flex items-center justify-center group"
              >
                <img
                  src={brand.img}
                  alt={brand.name}
                  title={brand.name}
                  className="
                    h-14 w-auto md:h-16
                    transition-transform duration-300
                    group-hover:scale-110
                    filter brightness-0 invert
                  "
                />
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </section>
  );
}
