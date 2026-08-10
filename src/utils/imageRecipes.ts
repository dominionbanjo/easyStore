export const IMAGE_RECIPES = {
  THUMBNAIL: {
    widths: [160],
    sizes: "5rem",
  },
  CARD: {
    widths: [400, 800],
    sizes: "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw",
  },
  CAROUSEL: {
    widths: [600, 1200],
    sizes: "(min-width: 1024px) 40vw, 90vw",
  },
  HERO: {
    widths: [1200, 1600],
    sizes: "100vw",
  },
  DETAIL: {
    widths: [1600],
    sizes: "(min-width: 1024px) 50vw, 100vw",
  },
  LOGO: {
    widths: [200],
    sizes: "8rem",
  },
} as const;

export type ImageRecipeName = keyof typeof IMAGE_RECIPES;
