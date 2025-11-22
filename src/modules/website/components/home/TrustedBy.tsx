import { Slack, Chrome, Zap, ShoppingBag, Youtube, Laptop, type LucideIcon } from 'lucide-react';

interface Company {
  name: string;
  Icon: LucideIcon;
}

export default function TrustedBy() {
  const companies: Company[] = [
    { name: 'Slack', Icon: Slack },
    { name: 'Chrome', Icon: Chrome },
    { name: 'Zap', Icon: Zap },
    { name: 'Shop', Icon: ShoppingBag },
    { name: 'YouTube', Icon: Youtube },
    { name: 'Tech', Icon: Laptop }
  ];

  return (
    <section className="py-8 bg-gradient-to-r from-blue-500 via-[#17c06e] to-white mt-20 transform -skew-y-2">
      <div className="max-w-[1700px] mx-auto px-6 transform skew-y-2">
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {/* Left text */}
          <div className="text-white font-medium text-sm md:text-base">
            They trust and <br/> grow with us
          </div>

          {/* Company logos */}
          {companies.map((company, index) => {
            const IconComponent = company.Icon;
            return (
              <div
                key={`${company.name}-${index}`}
                className="flex items-center justify-center group"
              >
                <IconComponent 
                  size={32}
                  className="text-white group-hover:scale-110 transition-transform duration-300"
                  strokeWidth={1.5}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}