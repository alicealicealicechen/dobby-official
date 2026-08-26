import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Post images are served from the Sanity asset CDN.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },

  async redirects() {
    return [
      // Anything without a locale prefix falls through to the default one, so
      // `/` lands on the Chinese site and `/typo` reaches a localised 404
      // rather than Next's unstyled fallback.
      { source: "/", destination: "/zh", permanent: false },
      {
        // Named capture, not $1 — Next matches with path-to-regexp.
        // `[^.]*` keeps anything with a file extension out of the rule, so
        // files served from public/ are never rewritten into a locale.
        source:
          "/:rest((?!(?:zh|en)(?:/|$))(?!_next|api|studio)[^.]*)",
        destination: "/zh/:rest",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
