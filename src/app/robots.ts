import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register"],
        disallow: [
          "/dashboard/",
          "/clients/",
          "/client/",
          "/vedic-astrology/",
          "/profile/",
          "/api/",
          "/calendar/",
          "/matchmaking/",
          "/muhurta/",
          "/comparison/",
        ],
      },
    ],
    sitemap: "https://grahvani.in/sitemap.xml",
  };
}
