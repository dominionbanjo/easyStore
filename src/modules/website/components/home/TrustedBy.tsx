interface Company {
  name: string;
  img: string;
}

export default function TrustedBy() {
  const companies: Company[] = [
    { name: "Facebook", img: '/logos/company/fb.png' },
    { name: "Instagram", img: '/logos/company/ig.png' },
    { name: "Tiktok", img: '/logos/company/TKTK.png' },
    { name: "Tiktok", img: '/logos/company/re.png' },
    { name: "Tiktok", img: '/logos/company/ty.png' },
    { name: "Tiktok", img: '/logos/company/ui.png' },
    { name: "Tiktok", img: '/logos/company/qw.png' },
    { name: "Tiktok", img: '/logos/company/yu.png' },
  ];

  return (
    <section className="py-12 mt-5 bg-gradient-to-r from-[#17c06e] via-[#5ed49c] to-[#17c06e] border w-full rounded-xl">
      <div className="max-w-[1700px] mx-auto px-6">
                                          
        <div className="flex flex-col items-center justify-center gap-8">

          {/* Text */}
          <p className="text-white font-semibold text-center text-lg md:text-xl leading-tight">
            Trusted By 40,000+ Company From Various Platforms
          </p>

          {/* Icons */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {companies.map((company) => (
              <div
                key={company.name}
                className="flex items-center justify-center group"
              >
                <img
                  src={company.img}
                  alt={company.name}
                  className="h-16 w-auto md:h-15 transition-transform duration-300 group-hover:scale-110 filter brightness-0 invert"
                />
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}