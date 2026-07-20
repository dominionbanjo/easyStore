import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Loader2,
  ShieldCheck,
  Tag,
  ShoppingBag,
  MapPin,
  Edit3,
  Truck,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import type { ICartItem } from "@/types/cart/cartTypes";
import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormSelect } from "@/components/shared/form/FormSelect";
import { Badge } from "@/components/ui/badge";

interface CheckoutSummaryProps {
  storeName?: string;
  items: ICartItem[];
  subtotal: number;
  shipping: number;
  serviceCharge: number;
  total: number;
  isProcessing: boolean;
  disabled: boolean;
  missingAddress?: boolean;
  missingBankVerification?: boolean;
  deliveryOptions?: {
    id: string;
    state: string;
    location: string;
    fee: number;
    duration: string | null;
  }[];
  currentAddress?: {
    street?: string | null;
    city?: string | null;
    state?: string | null;
  };
  selectedDeliveryRateId?: string;
  onSelectDeliveryRate?: (rateId: string) => void;
  isEscrow: boolean;
  setIsEscrow: (val: boolean) => void;
  onCheckout: (isEscrow: boolean) => void;
  onAddAddress: () => void;
  onVerifyBank: () => void;
  onMessageVendor: () => void;
}

export function CheckoutSummary({
  storeName,
  items,
  subtotal,
  shipping,
  serviceCharge,
  total,
  isProcessing,
  disabled,
  missingAddress,
  missingBankVerification,
  deliveryOptions,
  selectedDeliveryRateId,
  currentAddress,
  onSelectDeliveryRate,
  isEscrow,
  setIsEscrow,
  onCheckout,
  onAddAddress,
  onVerifyBank,
  onMessageVendor,
}: CheckoutSummaryProps) {
  const hasDeliveryOptions = deliveryOptions && deliveryOptions.length > 0;
  const isBlocked = missingAddress || missingBankVerification || (!selectedDeliveryRateId && hasDeliveryOptions);
  const noDeliveryAvailable = !hasDeliveryOptions;

  const methods = useForm<{ delivery_rate_id: string }>({
    defaultValues: {
      delivery_rate_id: selectedDeliveryRateId || "",
    },
  });

  // Sync internal form state with parent prop if it changes
  React.useEffect(() => {
    if (selectedDeliveryRateId) {
      methods.setValue("delivery_rate_id", selectedDeliveryRateId);
    }
  }, [selectedDeliveryRateId, methods]);

  return (
    <Card className="h-fit rounded-sm sm:rounded-sm border-border/40 bg-background border overflow-hidden">
      <CardHeader className="p-1 sm:p-8 border-b border-border/40 bg-muted/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl font-black uppercase tracking-tight text-foreground flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            {storeName ? `${storeName} Basket` : "Order Basket"}
          </CardTitle>
          <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest">
            {items.reduce((acc, item) => acc + item.quantity, 0)} Items
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-1 sm:p-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Scrollable Items list */}
          <div className="max-h-[280px] sm:max-h-[320px] overflow-y-auto pr-2 sm:pr-3 space-y-4 sm:space-y-6 custom-scrollbar">
            {items.map((item) => (
              <div
                key={`${item.product_id}-${item.variant_id ?? ""}-${item.variant_options ? JSON.stringify(item.variant_options) : `${item.size ?? "none"}-${item.color ?? "none"}`}`}
                className="flex gap-4 sm:gap-5 group"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-sm sm:rounded-sm overflow-hidden bg-muted border border-border/40 shrink-0 relative">
                  <img
                    src={item.image ?? "/placeholder.png"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-bl-xl">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-1 min-w-0 py-0.5 sm:py-1">
                  <p className="text-xs sm:text-sm font-black text-foreground truncate group-hover:text-primary transition-colors">
                    {item.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    {item.variant_options ? (
                      Object.entries(item.variant_options).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center gap-1 text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-muted-foreground/70 bg-muted/50 border border-border/40 px-1.5 py-0.5 rounded-sm"
                          >
                            {key.toLowerCase() === "color" &&
                              item.color_hex && (
                                <div
                                  className="w-1.5 h-1.5 rounded-sm border border-black/10"
                                  style={{ backgroundColor: item.color_hex }}
                                />
                              )}
                            <span className="opacity-50">{key}:</span> {value}
                          </div>
                        ),
                      )
                    ) : (
                      <>
                        {item.size && (
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 border border-border/40 px-1.5 py-0.5 rounded-sm bg-muted/30">
                            Size {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 border border-border/40 px-1.5 py-0.5 rounded-sm bg-muted/30 flex items-center gap-1.5">
                            {item.color_hex && (
                              <div
                                className="w-1.5 h-1.5 rounded-sm border border-black/10"
                                style={{ backgroundColor: item.color_hex }}
                              />
                            )}
                            {item.color}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right py-0.5 sm:py-1">
                  <p className="text-xs sm:text-sm font-black text-foreground whitespace-nowrap">
                    ₦
                    {(
                      ((item.discount_price && item.discount_price > 0
                        ? item.discount_price
                        : item.price) /
                        100) *
                      item.quantity
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 sm:space-y-4 pt-4 border-t border-border/40">
            {/* Selected Address Display */}
            {!missingAddress && currentAddress && (
              <div className="flex items-start justify-between p-3 rounded-sm border border-border/40 bg-muted/20 gap-4">
                <div className="flex gap-3 min-w-0">
                  <div className="mt-1 text-primary shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                      Delivery Location
                    </p>
                    <p className="text-sm font-semibold truncate leading-tight">
                      {currentAddress.street}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                      {currentAddress.city}, {currentAddress.state}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-sm text-muted-foreground hover:text-primary shrink-0"
                  onClick={onAddAddress}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex justify-between items-center text-xs sm:text-sm font-medium">
              <span className="text-muted-foreground">
                Original Basket Value
              </span>
              <span className="text-foreground font-black">
                ₦{(subtotal ?? 0).toLocaleString()}
              </span>
            </div>

            {hasDeliveryOptions ? (
              <div className="py-2">
                <FormProvider {...methods}>
                  <FormSelect
                    name="delivery_rate_id"
                    label="Delivery Region *"
                    placeholder="Select delivery region"
                    isSearchable
                    icon={<Truck className="h-4 w-4" />}
                    options={deliveryOptions.map((opt) => ({
                      value: opt.id,
                      label: `${opt.state} (${opt.location}) — ₦${Number(opt.fee).toLocaleString()}`,
                    }))}
                    onValueChange={onSelectDeliveryRate}
                    className="[&>label]:text-[10px] [&>label]:font-black [&>label]:uppercase [&>label]:tracking-widest [&>label]:text-muted-foreground/60"
                  />
                </FormProvider>
              </div>
            ) : (
              <div className="p-3 rounded-sm bg-amber-500/5 border border-amber-500/10 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">
                    No Delivery Region Configured
                  </p>
                </div>
                <p className="text-[9px] text-amber-600/70 font-medium leading-tight">
                  This vendor hasn't set up delivery for your location yet. Please contact them to arrange shipping.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onMessageVendor}
                  className="w-full h-8 text-[9px] font-black uppercase tracking-widest border-amber-500/20 text-amber-600 hover:bg-amber-500/10"
                >
                  <MessageCircle className="mr-2 h-3 w-3" />
                  Message Vendor
                </Button>
              </div>
            )}

            {/* Payment Method Selection */}
            <div className="pt-2 pb-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-3">
                Secure Payment Mode
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsEscrow(true)}
                  className={`flex flex-col items-start p-3 rounded-sm border transition-all text-left relative overflow-hidden group ${
                    isEscrow
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border/40 bg-card hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <ShieldCheck className={`h-4 w-4 ${isEscrow ? "text-primary" : "text-muted-foreground"}`} />
                    {isEscrow && <CheckCircle2 className="h-3 w-3 text-primary" />}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-tight ${isEscrow ? "text-primary" : "text-foreground"}`}>
                    Escrow
                  </span>
                  <Badge variant="secondary" className="absolute -right-6 top-1 rotate-45 text-[7px] py-0 px-6 bg-primary text-primary-foreground font-black uppercase tracking-widest">
                    Preferred
                  </Badge>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEscrow(false)}
                  className={`flex flex-col items-start p-3 rounded-sm border transition-all text-left relative ${
                    !isEscrow
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border/40 bg-card hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <CreditCard className={`h-4 w-4 ${!isEscrow ? "text-primary" : "text-muted-foreground"}`} />
                    {!isEscrow && <CheckCircle2 className="h-3 w-3 text-primary" />}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-tight ${!isEscrow ? "text-primary" : "text-foreground"}`}>
                    Direct
                  </span>
                </button>
              </div>
              
              {isEscrow && (
                <p className="mt-2 text-[9px] text-muted-foreground font-medium leading-relaxed flex items-start gap-1.5">
                  <span className="text-emerald-500 font-black shrink-0">TIP:</span>
                  Escrow keeps your funds safe until delivery is confirmed. Highly recommended for first-time buyers.
                </p>
              )}
            </div>

            <div className="flex justify-between items-center text-xs sm:text-sm font-medium text-emerald-600">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Logistics Fee</span>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-sm">
                  {selectedDeliveryRateId ? "Selected" : "Standard"}
                </span>
              </div>
              <span className="font-black">
                ₦{(shipping ?? 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Service Charge</span>
                <div className="flex items-center gap-1 bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm">
                  <Tag className="h-2.5 w-2.5" />
                  <span className="text-[9px] sm:text-[10px] font-black">
                    Incl. Fees
                  </span>
                </div>
              </div>
              <span className="text-foreground font-black">
                ₦{(serviceCharge ?? 0).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="relative pt-5 sm:pt-6">
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-1">
                  Grand Total
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                  VAT & Taxes included
                </p>
              </div>
              <span className="text-2xl sm:text-4xl font-black text-foreground tracking-tighter">
                ₦{(total ?? 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-1 sm:p-8 pt-0 pb-28 md:pb-8 flex flex-col gap-5 sm:gap-6">
        {/* Missing Requirements Warnings */}
        {(isBlocked || noDeliveryAvailable) && (
          <div className="w-full space-y-3">
            {missingAddress && (
              <div className="p-3.5 sm:p-4 rounded-sm bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-sm bg-amber-500 animate-pulse shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-[11px] sm:text-xs font-bold text-amber-600 uppercase tracking-wide">
                      Address Required
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-amber-600/80 font-medium max-w-[200px] leading-tight">
                      We need your delivery details to proceed.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onAddAddress}
                  className="h-8 text-[9px] sm:text-[10px] font-black uppercase tracking-widest border-amber-500/30 text-amber-700 hover:bg-amber-500/10 hover:text-amber-800 shrink-0 w-full sm:w-auto"
                >
                  Add Address
                </Button>
              </div>
            )}

            {missingBankVerification && (
              <div className="p-3.5 sm:p-4 rounded-sm bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-sm bg-blue-500 animate-pulse shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-[11px] sm:text-xs font-bold text-blue-600 uppercase tracking-wide">
                      Verification Needed
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-blue-600/80 font-medium max-w-[200px] leading-tight">
                      A valid bank account is required for refunds
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onVerifyBank}
                  className="h-8 text-[9px] sm:text-[10px] font-black uppercase tracking-widest border-blue-500/30 text-blue-700 hover:bg-blue-500/10 hover:text-blue-800 shrink-0 w-full sm:w-auto"
                >
                  Verify Now
                </Button>
              </div>
            )}

            {!selectedDeliveryRateId && hasDeliveryOptions && !missingAddress && (
              <div className="p-3.5 sm:p-4 rounded-sm bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-sm bg-emerald-500 animate-pulse shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-[11px] sm:text-xs font-bold text-emerald-600 uppercase tracking-wide">
                      Selection Required
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-emerald-600/80 font-medium max-w-[200px] leading-tight">
                      Please select a delivery region to calculate shipping.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {noDeliveryAvailable && !missingAddress && (
              <div className="p-3.5 sm:p-4 rounded-sm bg-rose-500/10 border border-rose-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-sm bg-rose-500 animate-pulse shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-[11px] sm:text-xs font-bold text-rose-600 uppercase tracking-wide">
                      Shipping Unavailable
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-rose-600/80 font-medium max-w-[200px] leading-tight">
                      Vendor has not configured delivery for this store.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onMessageVendor}
                  className="h-8 text-[9px] sm:text-[10px] font-black uppercase tracking-widest border-rose-500/30 text-rose-700 hover:bg-rose-500/10 hover:text-rose-800 shrink-0 w-full sm:w-auto"
                >
                  Message Vendor
                </Button>
              </div>
            )}
          </div>
        )}

        <Button
          className="w-full h-14 sm:h-16 rounded-sm text-xs sm:text-sm font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary hover:bg-primary/90 text-primary-foreground group disabled:opacity-50 disabled:pointer-events-none"
          disabled={disabled || isProcessing || isBlocked || noDeliveryAvailable}
          onClick={() => onCheckout(isEscrow)}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              Syncing Transaction...
            </>
          ) : (
            <>
              {isEscrow ? "Secure with Escrow" : "Proceed to Payment"}
              <CreditCard className="ml-3 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>

        <div className="flex items-center justify-center gap-4 sm:gap-6 p-3 sm:p-4 rounded-sm bg-muted/50 border border-border/20">
          <div className="flex flex-col items-center gap-1 opacity-60">
            <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
            <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
              Secure SSL
            </span>
          </div>
          <Separator orientation="vertical" className="h-6 sm:h-8 opacity-40" />
          <div className="flex flex-col items-center gap-1">
            <img
              src="/logos/paystacklogo.jpg"
              alt="Paystack"
              className="h-3 sm:h-4 grayscale hover:grayscale-0 transition-all cursor-help"
            />
            <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
              Processor
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
