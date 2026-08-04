import { useEffect, useState } from "react";
import { FormProvider, type SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { toast } from "sonner";
import {
  Image as ImageIcon,
  Tag,
  Settings,
  Truck,
  Layers,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import type {
  AddProductFormInput,
  AddProductFormOutput,
} from "@/modules/vendor/validators/addProductValidator";
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
  useGetVendorSingleProductQuery,
  usePublishProductDraftMutation,
  useGetProductDraftQuery,
} from "@/services/productApi";
import { buildSpecsObject } from "@/modules/vendor/utils/addProduct.helpers";
import { buildCreateProductPayload } from "@/utils/draftToFormValues";
import { productToDraft } from "@/modules/vendor/utils/productToDraft";
import { useProductExtras } from "@/modules/vendor/components/add-products/useProductExtras";
import { useAddProductForm } from "@/modules/vendor/components/add-products/useAddProductForm";
import { extractErrorMessage } from "@/utils/errorHandler";
import { useStoreSetup } from "@/modules/vendor/hooks/useStoreSetup";
import { getAppPath } from "@/utils/subdomain";
import { SetupEnforcementModal } from "@/modules/vendor/components/modals/SetupEnforcementModal";
import { BasicInfoSection } from "@/modules/vendor/components/add-products/BasicInfoSection";
import { ActionsSection } from "@/modules/vendor/components/add-products/ActionsSection";
import { ChipsSection } from "@/modules/vendor/components/add-products/ChipsSection";
import { ImageSection } from "@/modules/vendor/components/add-products/ImageSection";
import { ShippingSection } from "@/modules/vendor/components/add-products/ShippingSection";
import { SpecsSection } from "@/modules/vendor/components/add-products/SpecsSection";
import { Wrapper as PricingSectionWrapper } from "@/modules/vendor/components/add-products/PricingSectionWrapper";
import { cn } from "@/lib/utils";
import { SectionTooltip } from "@/components/shared/SectionTooltip";

export default function AddProductPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const draftParam = searchParams.get("draft");

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
    saveDraftNow,
    isSavingDraft,
    cancelSync,
  } = methods;

  const { data: draft } = useSelector((s: RootState) => s.productDraft);

  /* ───────── API ───────── */
  const { data: productData, isLoading: loadingProduct } =
    useGetVendorSingleProductQuery(slug!, { skip: !isEditMode });

  const productId = productData?.data?.product?.id;

  const [createProduct, { isLoading: creating }] =
    useCreateProductWithCloudinaryMutation();

  const [publishProduct, { isLoading: publishing }] =
    usePublishProductDraftMutation();

  const { data: resumeDraftData } = useGetProductDraftQuery(draftParam!, {
    skip: Boolean(isEditMode || !draftParam),
  });

  const { image, gallery, specs: specItems, tags, highlights } = extras;

  /* ───────── RESUME BACKEND DRAFT (?draft=) ───────── */
  useEffect(() => {
    if (isEditMode || !draftParam) return;
    if (!resumeDraftData?.data?.product) return;
    if (draft?.id === resumeDraftData.data.product.id) return;

    const { values, extras: normalizedExtras } = productToDraft(
      resumeDraftData.data.product,
    );

    dispatch(
      setProductDraft({
        ...values,
        ...normalizedExtras,
        id: resumeDraftData.data.product.id,
        syncedToBackend: true,
      }),
    );
  }, [isEditMode, draftParam, resumeDraftData, draft?.id, dispatch]);

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
        syncedToBackend: true,
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
        id: productId ?? draft?.id,
        syncedToBackend: draft?.syncedToBackend,
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
        await publishProduct({ draftId: productId!, data: payload }).unwrap();
        toast.success("Product updated successfully");
      } else if (draft?.id) {
        await publishProduct({ draftId: draft.id, data: payload }).unwrap();
        toast.success("Product published successfully");
      } else {
        await createProduct(payload).unwrap();
        toast.success("Product created successfully");
      }

      dispatch(clearProductDraft());
      cancelSync();
      navigate(getAppPath("/products"));
    } catch (err: unknown) {
      const errorMsg = extractErrorMessage(
        err,
        "Something went wrong while saving your product.",
      );

      const displayMsg = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg;
      toast.error(displayMsg);
    }
  };

  /* ───────── MANUAL SAVE DRAFT ───────── */
  const handleManualSaveDraft = async () => {
    try {
      await saveDraftNow();
      cancelSync();
      toast.success("Draft saved");
      dispatch(clearProductDraft());
      navigate(getAppPath("/products"));
    } catch {
      toast.error("Could not save draft. Please try again.");
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
        className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-20 pt-2 md:pt-4"
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

        <div className="flex flex-col gap-6 md:gap-8 w-full md:max-w-4xl mx-auto">
          {/* Identity Card */}
          <div>
            <Card className="border-border/40  overflow-hidden rounded-sm">
              <CardHeader className="bg-muted/30 p-4 md:p-8 border-b border-border/40">
                <div className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-sm bg-background flex items-center justify-center ">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base md:text-lg font-black uppercase tracking-tight">
                      Product Identity
                    </CardTitle>
                    <SectionTooltip content="Define the core identity of your product, including its name, category, and a compelling description to attract buyers." />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-8 space-y-6 md:space-y-8">
                <BasicInfoSection
                  highlights={extras.highlights}
                  setHighlights={extras.setHighlights}
                />
              </CardContent>
            </Card>
          </div>

          {/* Visuals Card */}
          <div>
            <Card className="border-border/40  overflow-hidden rounded-sm">
              <CardHeader className="bg-muted/30 p-4 md:p-8 border-b border-border/40">
                <div className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-sm bg-background flex items-center justify-center ">
                    <ImageIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base md:text-lg font-black uppercase tracking-tight">
                      Product Visuals
                    </CardTitle>
                    <SectionTooltip content="Upload high-quality images. The main image is the first thing buyers see, while gallery images provide different angles or features." />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-8">
                <ImageSection {...extras} storeSlug={extras.store?.slug} />
              </CardContent>
            </Card>
          </div>

          {/* Pricing Card */}
          <div>
            <Card className="border-border/40  overflow-hidden rounded-sm">
              <CardHeader className="bg-muted/30 p-4 md:p-8 border-b border-border/40">
                <div className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-sm bg-background flex items-center justify-center ">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base md:text-lg font-black uppercase tracking-tight">
                      Pricing & Stock
                    </CardTitle>
                    <SectionTooltip content="Set your base price and available inventory. If your product has variations (like size or color), you can set individual prices below." />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-8">
                <PricingSectionWrapper />
              </CardContent>
            </Card>
          </div>

          {/* Specifications Card */}
          <div>
            <Card className="border-border/40  overflow-hidden rounded-sm">
              <CardHeader className="bg-muted/30 p-4 md:p-8 border-b border-border/40">
                <div className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-sm bg-background flex items-center justify-center ">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base md:text-lg font-black uppercase tracking-tight">
                      Specifications
                    </CardTitle>
                    <SectionTooltip content="Add technical details, features, and searchable tags to help buyers understand your product better." />
                    <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-sm uppercase">
                      Optional
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-8 space-y-8 md:space-y-10">
                <SpecsSection {...extras} />
                <Separator className="bg-border/40" />
                <ChipsSection {...extras} />
              </CardContent>
            </Card>
          </div>

          {/* Logistics Card */}
          <div>
            <Card className="border-border/40  overflow-hidden rounded-sm">
              <CardHeader className="bg-muted/30 p-4 md:p-8 border-b border-border/40">
                <div className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-sm bg-background flex items-center justify-center ">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base md:text-lg font-black uppercase tracking-tight">
                      Logistics
                    </CardTitle>
                    <SectionTooltip content="Configure shipping costs and return policies to set clear expectations for delivery." />
                    <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-sm uppercase">
                      Optional
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-8">
                <ShippingSection />
              </CardContent>
            </Card>
          </div>

          {/* Bottom Actions */}
          <div className="pt-8 border-t border-border/40">
            <ActionsSection
              creating={creating || publishing}
              onPreview={handleSubmit(onPreview)}
              onCreate={handleSubmit(onSubmit)}
              onSaveDraft={handleManualSaveDraft}
              savingDraft={isSavingDraft}
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
