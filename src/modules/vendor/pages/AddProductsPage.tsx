import { useEffect, useState } from "react";
import { FormProvider, type SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Package,
  Image as ImageIcon,
  Tag,
  Settings,
  Truck,
  Layers,
  Sparkles,
  ChevronLeft,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import type {
  AddProductFormInput,
  AddProductFormOutput,
} from "../validators/addProductValidator";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  setProductDraft,
  clearProductDraft,
} from "@/features/productDraftSlice";
import {
  useCreateProductWithCloudinaryMutation,
  useGetSingleProductQuery,
  useUpdateProductWithCloudinaryMutation,
} from "@/services/productApi";
import { buildSpecsObject } from "../utils/addProduct.helpers";
import { buildCreateProductPayload } from "@/utils/draftToFormValues";
import { productToDraft } from "../utils/productToDraft";
import { useProductExtras } from "../components/add-products/useProductExtras";
import { useAddProductForm } from "../components/add-products/useAddProductForm";
import { useStoreSetup } from "../hooks/useStoreSetup";
import { getAppPath } from "@/utils/subdomain";
import { SetupEnforcementModal } from "../components/modals/SetupEnforcementModal";
import { BasicInfoSection } from "../components/add-products/BasicInfoSection";
import { ActionsSection } from "../components/add-products/ActionsSection";
import { ChipsSection } from "../components/add-products/ChipsSection";
import { ImageSection } from "../components/add-products/ImageSection";
import { ShippingSection } from "../components/add-products/ShippingSection";
import { SpecsSection } from "../components/add-products/SpecsSection";
import { Wrapper as PricingSectionWrapper } from "@/modules/vendor/components/add-products/PricingSectionWrapper";
import { cn } from "@/lib/utils";

export default function AddProductPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();

  const { isReady, isLoading: checkingSetup } = useStoreSetup();
  const [showSetupModal, setShowSetupModal] = useState(false);

  useEffect(() => {
    if (!checkingSetup && !isReady && !slug) {
      setShowSetupModal(true);
    }
  }, [checkingSetup, isReady, slug]);

  const isEditMode = Boolean(slug);

  /* ───────── FORM ───────── */
  const extras = useProductExtras();
  const methods = useAddProductForm(extras);
  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const {
    data: draft,
    isSyncing,
    lastSynced,
  } = useSelector((s: RootState) => s.productDraft);

  /* ───────── API ───────── */
  const { data: productData, isLoading: loadingProduct } =
    useGetSingleProductQuery(slug!, { skip: !isEditMode });

  const productId = productData?.data?.product?.id;

  const [createProduct, { isLoading: creating }] =
    useCreateProductWithCloudinaryMutation();

  const [updateProduct, { isLoading: updating }] =
    useUpdateProductWithCloudinaryMutation();

  const { image, gallery, specs: specItems, tags, highlights } = extras;

  /* ───────── CLEAR DRAFT WHEN SLUG CHANGES (or on unmount) ───────── */
  useEffect(() => {
    // When entering edit mode for a new slug, wipe any stale draft first.
    // clearProductDraft() is also dispatched from the product table's Edit
    // button, but this covers direct URL navigation and back-button scenarios.
    dispatch(clearProductDraft());

    return () => {
      // Also clear on unmount so leaving the page never leaves stale data
      // that could pollute the create-new or next-edit flow.
      dispatch(clearProductDraft());
    };
  }, [slug, dispatch]);

  /* ───────── HYDRATE EDIT MODE ───────── */
  useEffect(() => {
    if (!isEditMode || !productData?.data?.product) return;

    if (draft && draft.id === productData.data.product.id) {
      return;
    }

    const { values, extras: normalizedExtras } = productToDraft(
      productData.data.product,
    );

    // Consolidated hydration into draft state
    dispatch(
      setProductDraft({
        ...values,
        ...normalizedExtras,
        id: productData.data.product.id,
      }),
    );
  }, [isEditMode, productData, draft, dispatch]);

  /* ───────── PREVIEW ───────── */
  const onPreview = (data: AddProductFormInput) => {
    const values = data as unknown as AddProductFormOutput;
    dispatch(
      setProductDraft({
        ...values,
        image,
        gallery,
        tags,
        highlights,
        specs: buildSpecsObject(specItems),
        id: productId,
      }),
    );

    navigate(getAppPath("/products/preview"));
  };

  /* ───────── SUBMIT ───────── */
  const onSubmit: SubmitHandler<AddProductFormInput> = async (data) => {
    const values = data as unknown as AddProductFormOutput;

    if (!image) return toast.error("Upload a main product image");
    if (!gallery || gallery.length < 2)
      return toast.error("Upload at least 2 gallery images");

    const payload = buildCreateProductPayload({
      values,
      image,
      gallery,
      tags,
      highlights,
      specItems,
      options: values.options,
      variants: values.variants || [],
    });

    try {
      if (isEditMode) {
        await updateProduct({ id: productId!, data: payload }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await createProduct(payload).unwrap();
        toast.success("Product created successfully");
      }

      dispatch(clearProductDraft());
      navigate(getAppPath("/products"));
    } catch (err: any) {
      const errorMsg =
        err?.data?.message ||
        err?.data?.error ||
        "Something went wrong while saving your product.";

      const displayMsg = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg;
      toast.error(displayMsg);
    }
  };

  /* ───────── LOADING ───────── */
  if (isEditMode && loadingProduct) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
        <Skeleton className="h-12 w-64 rounded-sm" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-[400px] rounded-sm" />
            <Skeleton className="h-[200px] rounded-sm" />
          </div>
          <Skeleton className="h-[600px] rounded-sm" />
        </div>
      </div>
    );
  }

  const canSubmit = isValid && !!image && !!gallery && gallery.length >= 2;

  /* ───────── UI ───────── */
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-6xl mx-auto space-y-8 pb-20 pt-4"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
          <div className="space-y-3">
            <Link
              to={getAppPath("/products")}
              className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group"
            >
              <div className="p-1.5 rounded-sm bg-muted group-hover:bg-primary/10 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </div>
              Back to Catalog
            </Link>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-sm bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                  {isEditMode ? "Edit Product" : "New Product"}
                </h1>

                {/* Auto-save Status Indicator */}
                <div className="flex items-center gap-3 mt-1">
                  <div
                    className={cn(
                      "flex items-center gap-1.5 transition-all duration-500 px-3 py-0.5 rounded-sm border ",
                      isSyncing
                        ? "bg-amber-500/5 border-amber-500/20 text-amber-600 animate-pulse"
                        : "bg-emerald-500/5 border-emerald-500/20 text-emerald-600",
                    )}
                  >
                    {isSyncing ? (
                      <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-2.5 w-2.5" />
                    )}
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                      {isSyncing ? "Saving..." : "Draft Saved"}
                    </span>
                  </div>

                  {lastSynced && !isSyncing && (
                    <span className="text-[10px] font-bold text-muted-foreground/30 italic">
                      at{" "}
                      {new Date(lastSynced).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={cn(
                "h-8 px-4 rounded-sm font-bold uppercase tracking-wider text-[10px]",
                canSubmit
                  ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/5"
                  : "border-orange-500/30 text-orange-500 bg-orange-500/5",
              )}
            >
              <Sparkles className="h-3 w-3 mr-1.5" />
              {canSubmit ? "Ready to publish" : "Incomplete"}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          {/* Identity Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-border/40  overflow-hidden rounded-sm">
              <CardHeader className="bg-muted/30 p-6 md:p-8 border-b border-border/40">
                <div className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-sm bg-background flex items-center justify-center ">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-black uppercase tracking-tight">
                    Product Identity
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-5 sm:p-8 space-y-8">
                <BasicInfoSection
                  highlights={extras.highlights}
                  setHighlights={extras.setHighlights}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Visuals Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-border/40  overflow-hidden rounded-sm">
              <CardHeader className="bg-muted/30 p-6 md:p-8 border-b border-border/40">
                <div className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-sm bg-background flex items-center justify-center ">
                    <ImageIcon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-black uppercase tracking-tight">
                    Product Visuals
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-5 sm:p-8">
                <ImageSection {...extras} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-border/40  overflow-hidden rounded-sm">
              <CardHeader className="bg-muted/30 p-6 md:p-8 border-b border-border/40">
                <div className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-sm bg-background flex items-center justify-center ">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-black uppercase tracking-tight">
                    Pricing & Stock
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-5 sm:p-8">
                <PricingSectionWrapper />
              </CardContent>
            </Card>
          </motion.div>

          {/* Specifications Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-border/40  overflow-hidden rounded-sm">
              <CardHeader className="bg-muted/30 p-6 md:p-8 border-b border-border/40">
                <div className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-sm bg-background flex items-center justify-center ">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-black uppercase tracking-tight">
                      Specifications
                    </CardTitle>
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-sm">
                      Optional
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 sm:p-8 space-y-10">
                <SpecsSection {...extras} />
                <Separator className="bg-border/40" />
                <ChipsSection {...extras} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Logistics Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-border/40  overflow-hidden rounded-sm">
              <CardHeader className="bg-muted/30 p-6 md:p-8 border-b border-border/40">
                <div className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-sm bg-background flex items-center justify-center ">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-black uppercase tracking-tight">
                      Logistics
                    </CardTitle>
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-sm">
                      Optional
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 sm:p-8">
                <ShippingSection />
              </CardContent>
            </Card>
          </motion.div>

          {/* Bottom Actions */}
          <div className="pt-8 border-t border-border/40">
            <ActionsSection
              creating={creating || updating}
              onPreview={handleSubmit(onPreview)}
              onCreate={handleSubmit(onSubmit)}
              submitLabel={isEditMode ? "Update Product" : "Publish Product"}
              disabled={!canSubmit}
            />
            {!canSubmit && (
              <p className="text-[10px] text-center mt-4 font-bold text-muted-foreground uppercase tracking-widest px-4">
                Please complete and upload at least 2 gallery images to publish.
              </p>
            )}
          </div>
        </div>
      </form>

      <SetupEnforcementModal
        open={showSetupModal}
        onOpenChange={(open) => {
          setShowSetupModal(open);
          if (!open) navigate(getAppPath("/products"));
        }}
      />
    </FormProvider>
  );
}
