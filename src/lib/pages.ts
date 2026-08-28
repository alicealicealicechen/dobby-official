/**
 * Marketing page sections.
 *
 * Mirrors the `page` document from plan.md, whose `sections` array holds the
 * composable blocks (hero, band, points, plans, faq, cta). Keyed by locale, the
 * same document-level translation model the blog uses.
 */

import type { IconName } from "@/components/Icon";
import type { Locale } from "./i18n";
import { sanityFetch } from "./sanity";
import { homePageQuery, productPageQuery } from "./queries";

export type HomeContent = {
  hero: {
    eyebrow: string;
    titleLead: string;
    titleRest: string;
    highlight: string;
    lede: string;
  };
  band: { title: string; body: string; image?: string; imageAlt: string };
  pointsTitle: string;
  points: { title: string; body: string }[];
  cta: {
    eyebrow: string;
    title: string;
    lede: string;
    primary: string;
    secondary: { label: string; to: string }[];
  };
};

export type ProductContent = {
  hero: { title: string; lede: string };
  overview: {
    title: string;
    image?: string;
    imageAlt: string;
    features: { icon: IconName; title: string; body: string }[];
  };
  plansTitle: string;
  plans: {
    name: string;
    subtitle: string;
    description: string;
    features: string[];
  }[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
  closing: { title: string; cta: string };
};

const HOME: Record<Locale, HomeContent> = {
  zh: {
    hero: {
      eyebrow: "DOBBY AI — 地端企業級 AI 平台",
      titleLead: "高複雜場域的",
      titleRest: "協作，值得",
      highlight: "更好的 AI",
      lede: "可控、可追溯，真正融入團隊。在不連網路的環境要求下，讓 AI 成為真正協作的工作夥伴。",
    },
    band: {
      title: "100% 離線運作，不受外界干擾",
      body: "所有運算、知識庫與對話紀錄都留在企業自己的環境中，支援 on-premise、localhost 與全離線部署，不受外部網路與政策變動影響。",
      imageAlt: "離線運作示意",
    },
    pointsTitle: "打造 AI 真正參與溝通與協作的工作世界",
    points: [
      {
        title: "成為團隊的一份子",
        body: "長期參與會議、文件與專案流程，讓知識在使用中自然累積。",
      },
      {
        title: "可重現的流程設計",
        body: "從格式識別到結構化輸出，每個步驟都能被理解與檢視。",
      },
      {
        title: "行為邏輯，由你定義",
        body: "開放檢索門檻、採樣策略與生成彈性等關鍵參數調整。",
      },
      {
        title: "真正擁有，才能放心",
        body: "支援 on-premise、localhost 與全離線部署，資料留在機房。",
      },
    ],
    cta: {
      eyebrow: "GET STARTED",
      title: "想確認 Dobby AI 是否適合？",
      lede: "讓我們一起評估，如何在你的環境中安全地導入 AI。",
      primary: "預約 Demo",
      secondary: [
        { label: "了解產品", to: "/product" },
        { label: "閱讀部落格", to: "/blog" },
      ],
    },
  },

  en: {
    hero: {
      eyebrow: "DOBBY AI — ON-PREMISE ENTERPRISE AI",
      titleLead: "Complex work",
      // Trailing space: unlike CJK, the Latin highlight needs a word gap.
      titleRest: "deserves ",
      highlight: "better AI",
      lede: "Controllable, traceable, and genuinely part of the team — even in environments that never touch the internet.",
    },
    band: {
      title: "100% offline. Nothing leaves the building.",
      body: "Compute, knowledge base and conversation history all stay inside your own environment. Runs on-premise, on localhost, or fully air-gapped — unaffected by outside networks or shifting vendor policy.",
      imageAlt: "Offline operation",
    },
    pointsTitle: "Building a workplace where AI actually takes part",
    points: [
      {
        title: "A member of the team",
        body: "Sits in meetings, documents and project workflows so knowledge accumulates as you work.",
      },
      {
        title: "Reproducible by design",
        body: "From format recognition to structured output, every step can be inspected and understood.",
      },
      {
        title: "You define the behaviour",
        body: "Retrieval thresholds, sampling strategy and generation latitude are all yours to tune.",
      },
      {
        title: "Owning it is what makes it safe",
        body: "On-premise, localhost or fully offline — the data never leaves your server room.",
      },
    ],
    cta: {
      eyebrow: "GET STARTED",
      title: "Wondering whether Dobby AI fits?",
      lede: "Let's work out together how to bring AI into your environment safely.",
      primary: "Book a demo",
      secondary: [
        { label: "See the product", to: "/product" },
        { label: "Read the blog", to: "/blog" },
      ],
    },
  },
};

const PRODUCT: Record<Locale, ProductContent> = {
  zh: {
    hero: {
      title: "Dobby",
      lede: "從文件整理到 RAG 問答，一套完整、可重現、可稽核的地端 AI 工作流程。",
    },
    overview: {
      title: "功能總覽",
      imageAlt: "Dobby 工作平台介面",
      features: [
        {
          icon: "upload",
          title: "全離線資料處理",
          body: "PDF、Word、圖片、表格皆可在地端完成解析與索引。",
        },
        {
          icon: "lock",
          title: "完整權限管理",
          body: "依工作空間與專案設定存取範圍，確保每個人只看得到該看的資料。",
        },
        {
          icon: "edit",
          title: "參數可調行為邏輯",
          body: "檢索門檻、採樣策略與生成彈性皆可依場域調整。",
        },
      ],
    },
    plansTitle: "三種級別",
    plans: [
      {
        name: "Lite",
        subtitle: "經濟實惠",
        description: "小團隊初步驗證效果",
        features: [
          "支援 3 人同時使用",
          "支援至多 9 個 RAG 問答視窗",
          "雙模型驗證",
          "細緻流程資料處理",
        ],
      },
      {
        name: "Standard",
        subtitle: "企業優惠",
        description: "企業正式導入，AI 全面協作",
        features: [
          "Lite 方案的所有內容",
          "進階支援同時使用者 15 人",
          "無限制 RAG 問答視窗",
          "優先技術支援 / 客製串接",
        ],
      },
      {
        name: "Agent",
        subtitle: "專業用戶",
        description: "Agentic AI，複雜工作",
        features: [
          "Standard 方案的所有內容",
          "直接精準翻找資料",
          "更全面的 AI 體驗",
        ],
      },
    ],
    faqTitle: "常見問題",
    faqs: [
      {
        q: "市面上的 AI 方案很多，為什麼選擇 Dobby AI？",
        a: "我們專注服務「資料無法上雲」、受法規限制的企業。不追求服務所有人，而是理解這群企業的困境，把這個市場做到最好：讓 IT 保有掌控權，一般使用者也能輕鬆上手。",
      },
      {
        q: "這樣的投資，能為我們創造什麼價值？",
        a: "有客戶過往每天要花 30 分鐘檢查、交叉比對數十份文件，現在用 Dobby AI 不到 30 秒，在特殊屬性資料的細緻流程設計下準確率達 99%。更重要的是，他們建立起蒐集、搜尋與治理資料的知識庫，成為競爭對手難以追趕的優勢。",
      },
      {
        q: "目前市面上開源套件這麼多，我為什麼不自己搭建，要用 Dobby AI？",
        a: "開源工具給予自由，但持續優化需要時間。Dobby 用過往經驗處理軟體相依性與資料處理的問題，讓準確率盡可能泛化提升。如果您的 IT 時間更適合解決業務問題，Dobby AI 是值得信賴的起點。",
      },
      {
        q: "我們能真正掌控這套系統嗎？",
        a: "Dobby 的名字源自《哈利波特》裡渴望自由的小精靈。我們相信好的 AI 應該賦予自由，而非限制：IT 保有主導權、資料留在您的機房、系統可自由整合。我們建立的是夥伴關係，而不只是依賴關係。",
      },
    ],
    closing: { title: "想看看實際運作方式？", cta: "預約 Demo" },
  },

  en: {
    hero: {
      title: "Dobby",
      lede: "From document wrangling to RAG Q&A — one complete, reproducible, auditable on-premise AI workflow.",
    },
    overview: {
      title: "What it does",
      imageAlt: "The Dobby workspace",
      features: [
        {
          icon: "upload",
          title: "Fully offline data processing",
          body: "PDFs, Word files, images and tables are parsed and indexed entirely on your own hardware.",
        },
        {
          icon: "lock",
          title: "Full permission management",
          body: "Scope access by workspace and project, so people only ever see what they should.",
        },
        {
          icon: "edit",
          title: "Tunable behaviour",
          body: "Retrieval thresholds, sampling strategy and generation latitude adapt to your domain.",
        },
      ],
    },
    plansTitle: "Three tiers",
    plans: [
      {
        name: "Lite",
        subtitle: "Entry level",
        description: "For small teams validating the fit",
        features: [
          "3 concurrent users",
          "Up to 9 RAG Q&A sessions",
          "Dual-model verification",
          "Fine-grained data pipelines",
        ],
      },
      {
        name: "Standard",
        subtitle: "Business",
        description: "Full rollout, AI across the organisation",
        features: [
          "Everything in Lite",
          "Up to 15 concurrent users",
          "Unlimited RAG Q&A sessions",
          "Priority support and custom integration",
        ],
      },
      {
        name: "Agent",
        subtitle: "Advanced",
        description: "Agentic AI for complex work",
        features: [
          "Everything in Standard",
          "Precise autonomous document lookup",
          "The complete Dobby experience",
        ],
      },
    ],
    faqTitle: "Frequently asked",
    faqs: [
      {
        q: "There are plenty of AI vendors. Why Dobby AI?",
        a: "We serve companies whose data cannot go to the cloud and who work under regulatory constraints. Rather than trying to serve everyone, we understand this group's problems and do this market properly: IT keeps control, and ordinary users still find it easy.",
      },
      {
        q: "What return does this investment produce?",
        a: "One customer spent 30 minutes a day checking and cross-referencing dozens of documents. With Dobby AI it takes under 30 seconds, at 99% accuracy on their specific document types. More importantly, they built a knowledge base for collecting, searching and governing their data — an advantage competitors struggle to catch up with.",
      },
      {
        q: "With so many open-source packages available, why not build it ourselves?",
        a: "Open-source tools give you freedom, but continuous tuning takes time. Dobby brings prior experience with dependency management and data processing so accuracy generalises. If your IT team's hours are better spent on business problems, Dobby AI is a dependable place to start.",
      },
      {
        q: "Will we genuinely control the system?",
        a: "Dobby is named after the house-elf from Harry Potter who longed to be free. We believe good AI should grant freedom rather than restrict it: IT stays in charge, data stays in your server room, and the system integrates on your terms. We're building a partnership, not a dependency.",
      },
    ],
    closing: { title: "Want to see it working?", cta: "Book a demo" },
  },
};

/**
 * Sanity first, the copy above as the fallback — same contract as content.ts.
 * A `homePage` / `productPage` document overrides section by section, so a
 * partially-filled document still renders.
 */
export async function getHomeContent(locale: Locale): Promise<HomeContent> {
  const remote = await sanityFetch<Partial<HomeContent>>(
    homePageQuery,
    { locale },
    ["homePage"],
  );
  const seed = HOME[locale];
  if (!remote?.hero?.titleLead) return seed;

  return {
    hero: { ...seed.hero, ...remote.hero },
    band: { ...seed.band, ...remote.band },
    pointsTitle: remote.pointsTitle ?? seed.pointsTitle,
    points: remote.points?.length ? remote.points : seed.points,
    cta: { ...seed.cta, ...remote.cta },
  };
}

export async function getProductContent(
  locale: Locale,
): Promise<ProductContent> {
  const remote = await sanityFetch<Partial<ProductContent>>(
    productPageQuery,
    { locale },
    ["productPage"],
  );
  const seed = PRODUCT[locale];
  if (!remote?.hero?.title) return seed;

  return {
    hero: { ...seed.hero, ...remote.hero },
    overview: {
      ...seed.overview,
      ...remote.overview,
      features: remote.overview?.features?.length
        ? remote.overview.features
        : seed.overview.features,
    },
    plansTitle: remote.plansTitle ?? seed.plansTitle,
    plans: remote.plans?.length ? remote.plans : seed.plans,
    faqTitle: remote.faqTitle ?? seed.faqTitle,
    faqs: remote.faqs?.length ? remote.faqs : seed.faqs,
    closing: { ...seed.closing, ...remote.closing },
  };
}
