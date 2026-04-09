import { Heart, Share2, ShieldCheck, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UIProduct } from "@/modules/vendor/utils/productAdapter";

interface EditorialNarrativeProps {
  uiProduct: UIProduct;
  quantity: number;
  setQuantity: (q: number) => void;
  liked: boolean;
  selectedColor: { id: string; name: string; hex: string } | null;
  setSelectedColor: (
    color: { id: string; name: string; hex: string } | null,
  ) => void;
  selectedSize: string | null;
  setSelectedSize: (size: string | null) => void;
  addingToCart: boolean;
  currentStock: number;
  displayPrice: number;
  displayOriginalPrice: number | null | undefined;
  selectedOptions: Record<string, string>;
  selectOption: (name: string, value: string) => void;
  handleAddToCart: () => void;
  toggleWishlist: () => void;
}

export function EditorialNarrative({
  uiProduct,
  quantity,
  setQuantity,
  liked,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  addingToCart,
  currentStock,
  displayPrice,
  displayOriginalPrice,
  selectedOptions,
  selectOption,
  handleAddToCart,
  toggleWishlist,
}: EditorialNarrativeProps) {
  return (
    <main className="w-full flex flex-col min-h-screen">
      {/* Left Side: Images */}
      <div className="w-full min-h-[50vh] relative bg-[#F4F1EA] dark:bg-[#111]">
        <div className="w-full h-full overflow-y-auto no-scrollbar snap-y snap-mandatory">
          {uiProduct.images.length > 0 ? (
            uiProduct.images.map((img: string, idx: number) => (
              <div
                key={idx}
                className="w-full h-screen snap-start flex items-center justify-center p-2"
              >
                <img
                  src={img}
                  alt={`View ${idx}`}
                  className="w-full max-h-full object-cover "
                />
              </div>
            ))
          ) : (
            <div className="w-full h-screen flex items-center justify-center">
              <span className="opacity-50 tracking-widest uppercase">
                No Imagery
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Editorial Content */}
      <div className="w-full md:w-1/2 px-2 py-8 md:p-16 lg:p-24 flex flex-col justify-center">
        <div className="max-w-xl mx-auto space-y-12">
          <header className="space-y-6">
            <span className="text-sm font-sans uppercase tracking-[0.2em] text-[var(--theme-primary)]">
              Collection / {uiProduct.category}
            </span>
            <h1 className="text-5xl md:text-6xl font-medium leading-[1.1] tracking-tight">
              {uiProduct.name}
            </h1>
            <div className="flex items-center gap-6">
              <div className="flex items-baseline gap-4">
                <div className="text-3xl font-light">
                  ₦{displayPrice?.toLocaleString()}
                </div>
                {displayOriginalPrice && (
                  <div className="text-xl font-light text-zinc-400 line-through">
                    ₦{displayOriginalPrice.toLocaleString()}
                  </div>
                )}
              </div>
              <div
                className={cn(
                  "text-[10px] uppercase tracking-[0.3em] px-3 py-1 border rounded-sm",
                  currentStock > 0
                    ? "border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : "border-red-500/20 text-red-600 dark:text-red-400 font-bold",
                )}
              >
                {currentStock > 0 ? "In Reserve" : "Exhausted"}
              </div>
            </div>
          </header>

          <div className="prose prose-lg dark:prose-invert font-sans font-light leading-relaxed text-[#2C2C2C]/80 dark:text-[#EAEAEA]/80">
            <p>{uiProduct.description}</p>
          </div>

          <div className="space-y-8 font-sans">
            {uiProduct.options &&
              uiProduct.options.length > 0 &&
              uiProduct.options.map((option) => (
                <div key={option.name} className="space-y-4">
                  <span className="text-xs uppercase tracking-[0.2em]">
                    Select {option.name}
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {option.values.map((value) => (
                      <button
                        key={value}
                        onClick={() => selectOption(option.name, value)}
                        className={`px-6 py-3 border border-[#2C2C2C]/20 dark:border-[#EAEAEA]/20 text-sm tracking-widest uppercase transition-all ${
                          selectedOptions[option.name] === value
                            ? "bg-[#2C2C2C] text-[#FDFBF7] dark:bg-[#EAEAEA] dark:text-[#1A1A1A]"
                            : "hover:border-[#2C2C2C] dark:hover:border-[#EAEAEA]"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

            {uiProduct.colors.length > 0 && (
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-[0.2em]">
                  Select Pigment
                </span>
                <div className="flex flex-wrap gap-4">
                  {uiProduct.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-sm transition-all flex items-center justify-center ${
                        selectedColor?.id === color.id
                          ? "ring-1 ring-offset-4 ring-offset-[#FDFBF7] dark:ring-offset-[#1A1A1A] ring-[#2C2C2C] dark:ring-[#EAEAEA]"
                          : ""
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {uiProduct.sizes.length > 0 && (
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-[0.2em]">
                  Select Dimension
                </span>
                <div className="flex flex-wrap gap-3">
                  {uiProduct.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 border border-[#2C2C2C]/20 dark:border-[#EAEAEA]/20 text-sm tracking-widest uppercase transition-all ${
                        selectedSize === size
                          ? "bg-[#2C2C2C] text-[#FDFBF7] dark:bg-[#EAEAEA] dark:text-[#1A1A1A]"
                          : "hover:border-[#2C2C2C] dark:hover:border-[#EAEAEA]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-8 space-y-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center border-b border-[#2C2C2C]/20 dark:border-[#EAEAEA]/20 pb-2 font-sans font-medium text-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 opacity-50 hover:opacity-100"
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(currentStock || 1, quantity + 1))
                  }
                  className="px-4 opacity-50 hover:opacity-100"
                >
                  +
                </button>
              </div>
              <button
                disabled={currentStock <= 0 || addingToCart}
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-[#2C2C2C] dark:bg-[#EAEAEA] text-[#FDFBF7] dark:text-[#1A1A1A] font-sans font-medium uppercase tracking-[0.2em] text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-40 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-600 dark:disabled:text-zinc-300"
              >
                {addingToCart ? (
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-sm animate-spin" />
                ) : currentStock <= 0 ? (
                  "Piece Unavailable"
                ) : (
                  "Acquire Piece"
                )}
              </button>
            </div>
            <div className="flex justify-center gap-8 font-sans text-xs uppercase tracking-[0.2em] opacity-60">
              <button
                onClick={toggleWishlist}
                className={cn(
                  "flex items-center gap-2 hover:opacity-100 transition-opacity",
                  liked && "text-[var(--theme-primary)] opacity-100",
                )}
              >
                <Heart className={cn("w-4 h-4", liked && "fill-current")} />{" "}
                {liked ? "Saved" : "Save"}
              </button>
              <button className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>

          {/* Editorial Details Footer */}
          <div className="pt-16 mt-16 border-t border-[#2C2C2C]/10 dark:border-[#EAEAEA]/10 grid grid-cols-1 sm:grid-cols-2 gap-8 font-sans">
            <div>
              <ShieldCheck className="w-6 h-6 mb-4 opacity-60" />
              <h4 className="text-sm font-medium uppercase tracking-widest mb-2">
                Authenticity
              </h4>
              <p className="text-sm font-light opacity-60 leading-relaxed">
                Guaranteed original and securely processed.
              </p>
            </div>
            <div>
              <Truck className="w-6 h-6 mb-4 opacity-60" />
              <h4 className="text-sm font-medium uppercase tracking-widest mb-2">
                Logistics
              </h4>
              <p className="text-sm font-light opacity-60 leading-relaxed">
                Originating from {uiProduct.shipping.location}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
