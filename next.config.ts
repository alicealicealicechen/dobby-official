import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hides the floating dev-tools badge in the corner during `next dev`.
  devIndicators: false,

  images: {
    // Post images are served from the Sanity asset CDN.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },

  async redirects() {
    // Only the paths we actually own get redirected into the default locale.
    //
    // An earlier version used a catch-all `/:rest(...)` rule with an exclusion
    // list. It swallowed Next's own dev endpoints (/__nextjs_font,
    // /__nextjs_original-stack-frame, /turbopack-hmr), which broke HMR and made
    // the browser reload in a loop. Any blanket rule has the same hazard: it
    // intercepts every framework route that happens to lack a file extension.
    // Unprefixed paths we don't list simply 404, which is the safe failure.
    return [
      { source: "/", destination: "/zh", permanent: false },
      { source: "/product", destination: "/zh/product", permanent: false },
      { source: "/contact", destination: "/zh/contact", permanent: false },
      { source: "/blog", destination: "/zh/blog", permanent: false },
      {
        source: "/blog/:path*",
        destination: "/zh/blog/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
