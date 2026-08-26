/**
 * Content layer.
 *
 * Types mirror the Sanity content model in `sanity/schemaTypes` (`page`, `post`,
 * `author`, `category`, `seo`, `siteSettings`). Accessors query Sanity through
 * `lib/sanity.ts` and fall back to the seed content below when the CMS is not
 * configured yet, so the site renders both before and after Phase 2.
 */

import { sanityFetch } from "./sanity";
import {
  authorQuery,
  categoriesQuery,
  categoryQuery,
  postQuery,
  postsByCategoryQuery,
  postsQuery,
  siteSettingsQuery,
} from "./queries";

export type Seo = {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex?: boolean;
};

export type Author = {
  name: string;
  slug: string;
  bio?: string;
};

export type Category = {
  title: string;
  slug: string;
  description?: string;
  /** Accent used for the card band and category label. */
  color: string;
};

export type PostBlock = {
  id: string;
  heading: string;
  paragraphs: string[];
};

export type Post = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  mainImage?: { src: string; alt: string };
  body: PostBlock[];
  seo?: Seo;
};

export type NavItem = { label: string; href: string; key: string };

export type SiteSettings = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  address: string[];
  linkedin: string;
  nav: NavItem[];
  footerLegal: { label: string; href: string }[];
};

const SITE: SiteSettings = {
  name: "Dobby AI",
  tagline: "地端企業級 AI 平台",
  description:
    "地端企業級 AI 平台，為高複雜、關鍵基礎設施場域設計，讓 AI 成為真正融入團隊的工作夥伴。",
  url: "https://dobbyai.co",
  email: "sales@dobbyai.co",
  address: [
    "3F.-3, No. 262, Sec. 2, Beixin Rd.,",
    "Xindian Dist., New Taipei City, Taiwan",
  ],
  linkedin: "https://www.linkedin.com/",
  nav: [
    { key: "home", label: "首頁", href: "/" },
    { key: "product", label: "產品", href: "/product" },
    { key: "blog", label: "部落格", href: "/blog" },
    { key: "contact", label: "聯絡我們", href: "/contact" },
  ],
  footerLegal: [
    { label: "隱私權政策", href: "/privacy" },
    { label: "服務條款", href: "/terms" },
  ],
};

const CATEGORIES: Category[] = [
  {
    title: "產業洞察",
    slug: "insights",
    description: "地端 AI 導入的市場觀察與趨勢分析。",
    color: "var(--orange-600)",
  },
  {
    title: "技術",
    slug: "engineering",
    description: "拆解 Dobby 的檢索、驗證與資料處理流程。",
    color: "var(--sage-600)",
  },
  {
    title: "案例",
    slug: "case-studies",
    description: "企業導入 Dobby AI 的實際成果。",
    color: "var(--orange-900)",
  },
];

const AUTHOR: Author = {
  name: "Dobby AI 團隊",
  slug: "dobby-team",
  bio: "地端企業級 AI 平台團隊。",
};

const POSTS: Post[] = [
  {
    title: "地端部署 AI 常見的五個迷思",
    slug: "on-prem-ai-myths",
    excerpt:
      "許多團隊誤以為地端 AI 等於落後技術，實際上它是高治理場域的必要選擇。",
    category: "insights",
    publishedAt: "2026-07-02",
    readTime: "6 分鐘",
    body: [
      {
        id: "myth-1",
        heading: "迷思一：地端等於落後",
        paragraphs: [
          "地端部署常被誤認為技術上的妥協，但對資料無法離開機房的組織來說，它是唯一能真正落地的選項。真正的差別不在模型能力，而在於治理邊界畫在哪裡。",
        ],
      },
      {
        id: "myth-2",
        heading: "迷思二：維運成本一定更高",
        paragraphs: [
          "把授權費、資料外流風險與合規稽核成本一併計入後，地端方案在多數受監管產業反而更可預測，因為成本不會隨著使用量與外部政策變動。",
        ],
      },
      {
        id: "myth-3",
        heading: "迷思三：無法持續更新",
        paragraphs: [
          "模組化的部署架構讓模型與流程可以分開更新。知識庫與行為邏輯留在企業手上，底層能力則能依需求逐步替換。",
        ],
      },
    ],
  },
  {
    title: "如何評估企業導入 AI 的準備度",
    slug: "ai-readiness-assessment",
    excerpt:
      "從資料治理、流程標準化到團隊角色分工，導入前你該先確認的四件事。",
    category: "insights",
    publishedAt: "2026-06-18",
    readTime: "8 分鐘",
    body: [
      {
        id: "data",
        heading: "資料治理現況",
        paragraphs: [
          "先確認文件的存放位置、格式一致性與存取權限。資料越分散，導入初期需要投入的整理成本越高。",
        ],
      },
      {
        id: "process",
        heading: "流程標準化程度",
        paragraphs: [
          "AI 能穩定發揮的前提是流程本身可被描述。若同一件事在不同部門有五種做法，先收斂流程比先導入工具更重要。",
        ],
      },
      {
        id: "roles",
        heading: "團隊角色分工",
        paragraphs: [
          "需要明確指定誰負責維護知識庫、誰負責定義行為邏輯、誰負責驗收輸出品質。沒有負責人的系統會很快失去準確度。",
        ],
      },
    ],
  },
  {
    title: "RAG 系統如何確保引用可追溯",
    slug: "traceable-rag-citations",
    excerpt: "拆解 Dobby 的檢索與驗證流程，讓每一個回答都能回溯原始文件。",
    category: "engineering",
    publishedAt: "2026-06-04",
    readTime: "10 分鐘",
    mainImage: {
      src: "/images/offline-operation.jpg",
      alt: "可追溯的檢索流程示意",
    },
    body: [
      {
        id: "s1",
        heading: "引言",
        paragraphs: [
          "當 AI 的回答被用來支持實際決策時，「這個答案從哪裡來」和「答案本身」一樣重要。Dobby 的 RAG 系統把可追溯性當作設計的第一原則，而不是事後補上的功能。",
        ],
      },
      {
        id: "s2",
        heading: "檢索流程總覽",
        paragraphs: [
          "文件經過格式識別、內容標準化與語意解析後，會被轉換成可檢索的知識片段。每個片段都保留原始文件位置，確保任何回答都能回溯到具體頁碼與段落。",
        ],
      },
      {
        id: "s3",
        heading: "驗證機制設計",
        paragraphs: [
          "關鍵場景可啟用雙模型驗證：兩個模型分別產生答案並互相比對，只有結果一致時才視為高信心回答，否則交由使用者進一步確認。",
        ],
      },
      {
        id: "s4",
        heading: "實務建議",
        paragraphs: [
          "導入初期建議先從單一高頻使用情境切入，確認引用準確率符合預期後，再逐步擴大到跨部門的知識庫問答。",
        ],
      },
    ],
  },
  {
    title: "雙模型驗證：降低單一模型誤判的實務做法",
    slug: "dual-model-verification",
    excerpt: "在關鍵決策場景，兩個模型互相檢查比單一模型更可靠。",
    category: "engineering",
    publishedAt: "2026-05-22",
    readTime: "7 分鐘",
    body: [
      {
        id: "why",
        heading: "為什麼需要第二個模型",
        paragraphs: [
          "單一模型的錯誤往往具有一致性——它會用同樣的信心說出錯誤答案。引入第二個獨立模型後，不一致本身就成為一個可用的訊號。",
        ],
      },
      {
        id: "how",
        heading: "比對機制怎麼設計",
        paragraphs: [
          "兩個模型分別檢索與生成，系統再比對兩者引用的來源與結論。一致時標記為高信心，不一致時保留兩份結果並提示使用者確認。",
        ],
      },
    ],
  },
  {
    title: "案例：交叉比對時間從 30 分鐘降到 30 秒",
    slug: "cross-check-case-study",
    excerpt: "一家企業如何用 Dobby AI 重新設計文件比對流程。",
    category: "case-studies",
    publishedAt: "2026-05-09",
    readTime: "5 分鐘",
    body: [
      {
        id: "before",
        heading: "導入前的狀況",
        paragraphs: [
          "團隊每天需要人工檢查、交叉比對數十份文件，單次流程約需 30 分鐘，且結果會因人而異。",
        ],
      },
      {
        id: "after",
        heading: "導入後的改變",
        paragraphs: [
          "在特殊屬性資料的細緻流程設計下，同一份比對工作縮短到 30 秒內完成，準確率達 99%。更重要的是團隊同時建立起可持續累積的知識庫。",
        ],
      },
    ],
  },
  {
    title: "為什麼開源工具不能取代完整的資料治理",
    slug: "open-source-vs-governance",
    excerpt: "自由與可維護性之間，企業該如何權衡。",
    category: "engineering",
    publishedAt: "2026-04-27",
    readTime: "9 分鐘",
    body: [
      {
        id: "freedom",
        heading: "開源給的是自由，不是完成品",
        paragraphs: [
          "開源工具讓團隊保有選擇權，但軟體相依性、資料處理品質與長期維護仍需要投入時間。這些成本通常在導入半年後才會顯現。",
        ],
      },
      {
        id: "tradeoff",
        heading: "該怎麼權衡",
        paragraphs: [
          "如果 IT 團隊的時間更適合拿來解決業務問題，選擇一個已經處理好這些細節的起點會更划算。反之若團隊有餘裕，自建也是合理選項。",
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------
   Accessors — Sanity first, seed content as the fallback.

   Each one asks Sanity and uses the result when the CMS returns something.
   Before the project exists (or if a query fails) `sanityFetch` returns null
   and the seed values below keep the site rendering.
   ------------------------------------------------------------------ */

export async function getSiteSettings(): Promise<SiteSettings> {
  const remote = await sanityFetch<SiteSettings>(siteSettingsQuery);
  return remote?.name ? { ...SITE, ...remote } : SITE;
}

export async function getCategories(): Promise<Category[]> {
  const remote = await sanityFetch<Category[]>(categoriesQuery);
  return remote?.length ? remote : CATEGORIES;
}

export async function getCategory(slug: string): Promise<Category | null> {
  const remote = await sanityFetch<Category>(categoryQuery, { slug });
  return remote ?? CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export async function getPosts(): Promise<Post[]> {
  const remote = await sanityFetch<Post[]>(postsQuery);
  if (remote?.length) return remote;
  return [...POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getPost(slug: string): Promise<Post | null> {
  const remote = await sanityFetch<Post>(postQuery, { slug });
  return remote ?? POSTS.find((p) => p.slug === slug) ?? null;
}

export async function getPostsByCategory(slug: string): Promise<Post[]> {
  const remote = await sanityFetch<Post[]>(postsByCategoryQuery, { slug });
  if (remote?.length) return remote;
  const posts = await getPosts();
  return posts.filter((p) => p.category === slug);
}

export async function getAuthor(slug = AUTHOR.slug): Promise<Author | null> {
  const remote = await sanityFetch<Author>(authorQuery, { slug });
  return remote ?? (slug === AUTHOR.slug ? AUTHOR : null);
}

/** Resolves a post's category record, falling back to the first category. */
export function resolveCategory(
  categories: Category[],
  slug: string,
): Category {
  return categories.find((c) => c.slug === slug) ?? categories[0];
}
