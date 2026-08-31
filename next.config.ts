import type { NextConfig } from "next";

/**
 * Headers Vercel does not send by default. HSTS is already set by the platform,
 * so it is deliberately absent here.
 *
 * There is no script/style CSP: a strict one needs per-request nonces threaded
 * through middleware, and a loose one (`unsafe-inline`) buys nothing but a
 * passing scanner result. `frame-ancestors` is the exception — it is the part
 * of CSP that needs no nonce, and it is what actually stops clickjacking on
 * /studio. Revisit the full policy if the site ever renders untrusted HTML.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  // Superseded by frame-ancestors, kept for browsers that predate it.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  // Hides the floating dev-tools badge in the corner during `next dev`.
  devIndicators: false,

  images: {
    // Post images are served from the Sanity asset CDN.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
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
