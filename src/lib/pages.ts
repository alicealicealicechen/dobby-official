/**
 * Marketing page sections.
 *
 * Mirrors the `page` document from plan.md, whose `sections` array holds the
 * composable blocks (hero, band, list, plans, faq, cta). Same contract as
 * `content.ts`: async accessors, swap the bodies for GROQ in Phase 2.
 */

import type { IconName } from "@/components/Icon";

export type HomeContent = {
  hero: { eyebrow: string; title: string; highlight: string; lede: string };
  band: { title: string; body: string; image: { src: string; alt: string } };
  pointsTitle: string;
  points: { title: string; body: string }[];
  cta: {
    eyebrow: string;
    title: string;
    lede: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string }[];
  };
};

export type ProductContent = {
  hero: { title: string; lede: string };
  overview: {
    title: string;
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
  closing: { title: string; cta: { label: string; href: string } };
};

const HOME: HomeContent = {
  hero: {
    eyebrow: "DOBBY AI — 地端企業級 AI 平台",
    title: "高複雜場域的協作，值得",
    highlight: "更好的 AI",
    lede: "可控、可追溯，真正融入團隊。在不連網路的環境要求下，讓 AI 成為真正協作的工作夥伴。",
  },
  band: {
    title: "100% 離線運作，不受外界干擾",
    body: "所有運算、知識庫與對話紀錄都留在企業自己的環境中，支援 on-premise、localhost 與全離線部署，不受外部網路與政策變動影響。",
    image: { src: "/images/offline-operation.jpg", alt: "離線運作示意" },
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
    primary: { label: "預約 Demo", href: "/contact" },
    secondary: [
      { label: "了解產品", href: "/product" },
      { label: "閱讀部落格", href: "/blog" },
    ],
  },
};

const PRODUCT: ProductContent = {
  hero: {
    title: "Dobby",
    lede: "從文件整理到 RAG 問答，一套完整、可重現、可稽核的地端 AI 工作流程。",
  },
  overview: {
    title: "功能總覽",
    features: [
      {
        icon: "upload",
        title: "全離線資料處理",
        body: "PDF、Word、圖片、表格皆可在地端完成解析與索引。",
      },
      {
        icon: "dualChat",
        title: "雙模型交叉驗證",
        body: "關鍵決策場景可啟用雙模型比對，降低單一模型誤判。",
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
  closing: {
    title: "想看看實際運作方式？",
    cta: { label: "預約 Demo", href: "/contact" },
  },
};

export async function getHomeContent(): Promise<HomeContent> {
  return HOME;
}

export async function getProductContent(): Promise<ProductContent> {
  return PRODUCT;
}
