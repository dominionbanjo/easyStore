import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { resolve } from "path";

// Define the precise list of public routes based on src/App.tsx
const PUBLIC_ROUTES = [
  "/",
  "/s",
  "/stores",
  "/categories",
  "/about",
  "/privacy-policy",
  "/terms-of-service",
  "/careers",
  "/discovery",
  "/featured",
  "/trending",
  "/new-arrivals",
  "/start-selling",
  "/auth/login",
  "/auth/signup",
  "/auth/verify-otp",
  "/auth/forgot-password",
  "/auth/reset-password",
];

// Routes to explicitly disallow in robots.txt
const PROTECTED_PATHS = [
  "/account/",
  "/vendor/",
  "/admin/",
  "/auth/", // often good to disallow auth pages to prevent crawling login forms
];

// Helper to load env vars from .env file manually (to avoid adding dotenv dependency just for this)
const loadEnv = () => {
  try {
    const envPath = resolve(process.cwd(), ".env");
    if (existsSync(envPath)) {
      const envFile = readFileSync(envPath, "utf-8");
      const lines = envFile.split("\n");
      for (const line of lines) {
        const [key, value] = line.split("=");
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      }
    }
  } catch {
    console.warn("⚠️ Could not read .env file, using defaults");
  }
};

loadEnv();

const FRONTEND_URL = process.env.VITE_APP_URL || "https://eazystore.com.ng";

const generateSitemap = () => {
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PUBLIC_ROUTES.map((route) => {
  return `  <url>
    <loc>${FRONTEND_URL}${route === "/" ? "" : route}</loc>
    <changefreq>daily</changefreq>
    <priority>${route === "/" ? "1.0" : "0.8"}</priority>
  </url>`;
}).join("\n")}
</urlset>`;

  const publicDir = resolve(process.cwd(), "public");

  if (!existsSync(publicDir)) {
    mkdirSync(publicDir);
  }

  writeFileSync(resolve(publicDir, "sitemap.xml"), sitemapContent);
  console.log("✅ Generated public/sitemap.xml");
};

const generateRobotsTxt = () => {
  // Robust robots.txt configuration
  // 1. Allow search engines to index public content
  // 2. Disallow protected routes (admin, account, vendor)
  // 3. Block common AI scrapers to prevent unauthorized data training/scraping

  const robotsContent = `# Standard Rules
User-agent: *
Allow: /
${PROTECTED_PATHS.map((path) => `Disallow: ${path}`).join("\n")}

# Block Common AI Scrapers & Bots
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Omgilibot
Disallow: /

User-agent: FacebookBot
Disallow: /

Sitemap: ${FRONTEND_URL}/sitemap.xml
`;

  const publicDir = resolve(process.cwd(), "public");
  writeFileSync(resolve(publicDir, "robots.txt"), robotsContent);
  console.log("✅ Generated public/robots.txt");
};

try {
  console.log(`Processesing for URL: ${FRONTEND_URL}`);
  generateSitemap();
  generateRobotsTxt();
} catch (error) {
  console.error("Error generating sitemap/robots.txt:", error);
  process.exit(1);
}
