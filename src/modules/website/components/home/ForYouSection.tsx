import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { selectLocationState } from "@/features/locationSlice";
import { useGetForYouRecommendationsQuery } from "@/services/recommendationApi";
import { ProductSection } from "./ProductSection";
import ProductGridCard from "@/components/shared/ProductGridCard";
import SmartLink from "@/components/shared/SmartLink";
import { ACCOUNT_ROUTES } from "@/routes";
import { useInView } from "@/modules/website/hooks/useInView";

export default function ForYouSection() {
  const locationState = useSelector(selectLocationState);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated,
  );
  const { ref: sectionRef, isInView } = useInView<HTMLDivElement>({
    rootMargin: "800px 0px",
    once: true,
  });

  const { data, isLoading, isError } = useGetForYouRecommendationsQuery(
    {
      limit: 10,
      state: locationState ?? undefined,
    },
    { skip: !isInView },
  );

  const products = data?.data?.items ?? [];
  const personalized = data?.data?.personalized ?? false;

  return (
    <div ref={sectionRef} data-scroll-anchor="for-you">
      <ProductSection
      title={personalized ? "Recommended for You" : "Trending Now"}
      subtitle={
        personalized
          ? "Picked for you from your preferences, purchases, wishlist and cart."
          : "What shoppers are loving right now — sign in and pick your interests for personalised picks."
      }
      isLoading={!isInView || isLoading}
      isError={isError}
      isEmpty={isInView && !products.length && !isLoading && !isError}
      emptyIcon={personalized ? Sparkles : TrendingUp}
      emptyTitle="Nothing to show yet"
      emptyDescription="New recommendations are on the way. Check back soon!"
      className="bg-muted/10"
      headerAction={
        isAuthenticated && !personalized ? (
          <SmartLink to={ACCOUNT_ROUTES.SETTINGS}>
            <span className="group flex items-center gap-1 text-base font-bold text-primary hover:text-primary/80 transition-colors">
              Personalise your feed
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </SmartLink>
        ) : undefined
      }
    >
      {products.map((product) => (
        <ProductGridCard key={product.id} data={product} />
      ))}
      </ProductSection>
    </div>
  );
}
