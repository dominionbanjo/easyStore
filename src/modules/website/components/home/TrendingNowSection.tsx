import { TrendingUp, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { selectLocationState } from "@/features/locationSlice";
import { useGetTrendingRecommendationsQuery } from "@/services/recommendationApi";
import { ProductSection } from "./ProductSection";
import ProductGridCard from "@/components/shared/ProductGridCard";
import SmartLink from "@/components/shared/SmartLink";
import { WEBSITE_ROUTES } from "@/routes";
import { useInView } from "@/modules/website/hooks/useInView";

export default function TrendingNowSection() {
  const locationState = useSelector(selectLocationState);
  const { ref: sectionRef, isInView } = useInView<HTMLDivElement>({
    rootMargin: "800px 0px",
    once: true,
  });

  const { data, isLoading, isError } = useGetTrendingRecommendationsQuery(
    {
      limit: 10,
      state: locationState ?? undefined,
    },
    { skip: !isInView },
  );

  const products = data?.data?.items ?? [];

  return (
    <div ref={sectionRef}>
      <ProductSection
      title="Trending Now"
      subtitle="The fastest-moving products across EasyStore this week."
      isLoading={isLoading}
      isError={isError}
      isEmpty={!products.length}
      emptyIcon={TrendingUp}
      emptyTitle="No trending items yet"
      emptyDescription="Popular products will appear here as shoppers engage."
      headerAction={
        <SmartLink to={WEBSITE_ROUTES.TRENDING}>
          <span className="group flex items-center gap-1 text-base font-bold text-primary hover:text-primary/80 transition-colors">
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </SmartLink>
      }
    >
      {products.map((product) => (
        <ProductGridCard key={product.id} data={product} />
      ))}
      </ProductSection>
    </div>
  );
}
