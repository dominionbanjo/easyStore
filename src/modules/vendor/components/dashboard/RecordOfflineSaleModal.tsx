import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetMyStoreProductsQuery } from "@/services/productApi";
import { useRecordVendorOfflineSaleMutation } from "@/services/ordersApi";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  Tag,
  Search as SearchIcon,
  User,
  Mail,
  MessageSquare,
} from "lucide-react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormSelect } from "@/components/shared/form/FormSelect";
import { FormTextarea } from "@/components/shared/form/FormTextarea";
import { useDebounce } from "@/hooks";

const offlineSaleSchema = z.object({
  customer_name: z.string().optional(),
  customer_email: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        product_id: z.string().min(1, "Product is required"),
        variant_id: z.string().optional(),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      }),
    )
    .min(1, "Please add at least one product"),
});

type OfflineSaleFormValues = z.infer<typeof offlineSaleSchema>;

interface RecordOfflineSaleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecordOfflineSaleModal({
  open,
  onOpenChange,
}: RecordOfflineSaleModalProps) {
  const [productSearch, setProductSearch] = useState("");
  const debouncedProductSearch = useDebounce(productSearch, 500);

  const { data: productsData } = useGetMyStoreProductsQuery({
    q: debouncedProductSearch,
    limit: 50, // Fetch more for selection
  });

  const [recordSale, { isLoading: submitting }] =
    useRecordVendorOfflineSaleMutation();

  const methods = useForm<OfflineSaleFormValues>({
    resolver: zodResolver(offlineSaleSchema),
    defaultValues: {
      customer_name: "",
      customer_email: "",
      notes: "",
      items: [{ product_id: "", variant_id: "", quantity: 1 }],
    },
  });

  const { control, handleSubmit, watch, reset } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const products = productsData?.data?.items || [];
  const productOptions = products.map((p) => ({
    label: p.name,
    value: p.id,
  }));

  // Watch items to provide variants
  const watchedItems = watch("items");

  useEffect(() => {
    if (!open) {
      reset();
      setProductSearch("");
    }
  }, [open, reset]);

  const onFormSubmit = async (values: OfflineSaleFormValues) => {
    try {
      await recordSale({
        items: values.items.map((item) => ({
          product_id: item.product_id,
          variant_id: item.variant_id || undefined,
          quantity: item.quantity,
        })),
        customer_name: values.customer_name || undefined,
        customer_email: values.customer_email || undefined,
        notes: values.notes || undefined,
      }).unwrap();

      toast.success("Offline sale recorded successfully!");
      onOpenChange(false);
      reset();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to record sale");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] font-outfit max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-black italic uppercase tracking-tighter">
            <Tag className="h-6 w-6 text-primary" />
            Record Offline Sale
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium">
            Keep your inventory synced by logging sales made physically or
            outside the platform.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="space-y-8 mt-6"
          >
            {/* ─── SALE ITEMS SECTION ─── */}
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary/70 flex items-center gap-2">
                  <Plus className="h-3 w-3" /> Products Sold
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({ product_id: "", variant_id: "", quantity: 1 })
                  }
                  className="h-8 rounded-sm bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all font-bold text-xs uppercase"
                >
                  Add Another Product
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => {
                  const selectedProductId = watchedItems[index]?.product_id;
                  const selectedProduct = products.find(
                    (p) => p.id === selectedProductId,
                  );
                  const variantOptions =
                    selectedProduct?.variants?.map((v: any, vIdx: number) => ({
                      label: v.sku || `Variant ${v.id?.slice(-4) || vIdx + 1}`,
                      value: v.id || v.sku || String(vIdx),
                    })) || [];

                  return (
                    <div 
                      key={field.id} 
                      className="bg-muted/20 p-4 sm:p-5 rounded-sm border border-border/40 hover:border-primary/20 transition-all relative group space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
                        <FormSelect
                          name={`items.${index}.product_id`}
                          label={index === 0 ? "Product" : undefined}
                          placeholder="Search & Select Product"
                          options={productOptions}
                          isSearchable
                          onSearchChange={(val) => setProductSearch(val)}
                          className="w-full"
                          icon={<SearchIcon className="h-4 w-4" />}
                        />

                        {variantOptions.length > 0 && (
                          <FormSelect
                            name={`items.${index}.variant_id`}
                            label={index === 0 ? "Variant" : undefined}
                            placeholder="Variant"
                            options={variantOptions}
                            className="w-full md:w-[160px]"
                          />
                        )}
                      </div>

                      <div className="flex items-end gap-4">
                        <div className="flex-1">
                          <FormInput
                            name={`items.${index}.quantity`}
                            type="number"
                            label={index === 0 ? "Qty" : undefined}
                            placeholder="0"
                            className="w-full"
                            rules={{ valueAsNumber: true }}
                          />
                        </div>

                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-12 w-12 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors border border-border/40 md:border-none shrink-0"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ─── CUSTOMER INFO SECTION ─── */}
            <div className="space-y-5 pt-4 border-t border-border/40">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary/70 flex items-center gap-2">
                <User className="h-3 w-3" /> Customer Information (Optional)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  name="customer_name"
                  label="Customer Name"
                  placeholder="e.g. John Doe"
                  icon={<User className="h-4 w-4" />}
                />
                <FormInput
                  name="customer_email"
                  type="email"
                  label="Customer Email"
                  placeholder="john@example.com"
                  icon={<Mail className="h-4 w-4" />}
                />
              </div>

              <FormTextarea
                name="notes"
                label="Internal Sale Notes"
                placeholder="Details about the transaction..."
                icon={<MessageSquare className="h-4 w-4" />}
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-14 text-sm uppercase tracking-[0.2em] font-black italic bg-primary hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.3)] transition-all"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Recording Sale Details...
                  </>
                ) : (
                  "Record Sale"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
