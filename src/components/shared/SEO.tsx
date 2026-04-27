import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string | null | undefined;
  type?: string;
  url?: string;
}

const DEFAULT_TITLE = "EasyStore | Empowering Your eCommerce";
const DEFAULT_DESCRIPTION = "The premier multi-vendor ecommerce platform. Start, manage, and scale your online business effortlessly.";
const DEFAULT_IMAGE = "/logos/inline-stripe-transparent-dark.png";

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  type = "website",
  url,
}: SEOProps) {
  // If the user explicitly passes `null` for the image (e.g. for store pages without banner),
  // we do not render an image. If it's undefined, we fallback to DEFAULT_IMAGE.
  const seoImage = image === undefined ? DEFAULT_IMAGE : image;
  const siteUrl = window?.location?.href || url || "";

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title ? `${title} | EasyStore` : DEFAULT_TITLE}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={title ? `${title} | EasyStore` : DEFAULT_TITLE} />
      <meta property="og:description" content={description} />
      {seoImage && <meta property="og:image" content={seoImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content={seoImage ? "summary_large_image" : "summary"} />
      <meta name="twitter:url" content={siteUrl} />
      <meta name="twitter:title" content={title ? `${title} | EasyStore` : DEFAULT_TITLE} />
      <meta name="twitter:description" content={description} />
      {seoImage && <meta name="twitter:image" content={seoImage} />}
    </Helmet>
  );
}
