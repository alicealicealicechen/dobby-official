/**
 * Content layer.
 *
 * Types mirror the Sanity content model in `sanity/schemaTypes`. Accessors take
 * a locale and query Sanity through `lib/sanity.ts`, falling back to the seed
 * content below when the CMS is not configured yet.
 *
 * Translation is document-level: in Sanity each post/category exists once per
 * language with a `language` field, and every query filters on it. The seed
 * data mirrors that by keying each collection on locale.
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
import type { Locale } from "./i18n";

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
  /** Served from the Sanity asset CDN; absent until the post has one. */
  mainImage?: { src: string; alt: string };
  body: PostBlock[];
  seo?: Seo;
};

export type SiteSettings = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  address: string[];
  linkedin: string;
};

const SITE: Record<Locale, SiteSettings> = {
  zh: {
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
  },
  en: {
    name: "Dobby AI",
    tagline: "On-premise enterprise AI platform",
    description:
      "An on-premise enterprise AI platform built for complex, critical-infrastructure environments — so AI can genuinely join the team.",
    url: "https://dobbyai.co",
    email: "sales@dobbyai.co",
    address: [
      "3F.-3, No. 262, Sec. 2, Beixin Rd.,",
      "Xindian Dist., New Taipei City, Taiwan",
    ],
    linkedin: "https://www.linkedin.com/",
  },
};

const CATEGORIES: Record<Locale, Category[]> = {
  zh: [
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
  ],
  en: [
    {
      title: "Industry insights",
      slug: "insights",
      description: "Market observations and trends in on-premise AI adoption.",
      color: "var(--orange-600)",
    },
    {
      title: "Engineering",
      slug: "engineering",
      description:
        "How Dobby's retrieval, verification and data pipelines actually work.",
      color: "var(--sage-600)",
    },
    {
      title: "Case studies",
      slug: "case-studies",
      description: "What changed after teams put Dobby AI to work.",
      color: "var(--orange-900)",
    },
  ],
};

const AUTHOR: Record<Locale, Author> = {
  zh: {
    name: "Dobby AI 團隊",
    slug: "dobby-team",
    bio: "地端企業級 AI 平台團隊。",
  },
  en: {
    name: "Dobby AI Team",
    slug: "dobby-team",
    bio: "The team behind the on-premise enterprise AI platform.",
  },
};

const POSTS: Record<Locale, Post[]> = {
  zh: [
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
  ],

  en: [
    {
      title: "Five myths about deploying AI on-premise",
      slug: "on-prem-ai-myths",
      excerpt:
        "On-premise AI gets mistaken for dated technology. For heavily governed environments it is the only workable option.",
      category: "insights",
      publishedAt: "2026-07-02",
      readTime: "6 min",
      body: [
        {
          id: "myth-1",
          heading: "Myth one: on-premise means behind the curve",
          paragraphs: [
            "On-premise deployment is often read as a technical compromise. For organisations whose data cannot leave the building, it is the only option that actually ships. The real difference is not model capability — it is where the governance boundary sits.",
          ],
        },
        {
          id: "myth-2",
          heading: "Myth two: it always costs more to run",
          paragraphs: [
            "Once licence fees, data-exfiltration risk and compliance audit costs are counted, on-premise is usually the more predictable option in regulated industries, because the bill does not move with usage or with someone else's policy changes.",
          ],
        },
        {
          id: "myth-3",
          heading: "Myth three: you can never update it",
          paragraphs: [
            "A modular deployment lets models and pipelines be updated separately. The knowledge base and the behavioural rules stay with the business while the underlying capability is swapped out as needed.",
          ],
        },
      ],
    },
    {
      title: "How to assess whether your organisation is ready for AI",
      slug: "ai-readiness-assessment",
      excerpt:
        "Data governance, process standardisation and role ownership — four things to confirm before you start.",
      category: "insights",
      publishedAt: "2026-06-18",
      readTime: "8 min",
      body: [
        {
          id: "data",
          heading: "The state of your data governance",
          paragraphs: [
            "Start by confirming where documents live, how consistent their formats are, and who can access them. The more scattered the data, the more clean-up the first phase will cost.",
          ],
        },
        {
          id: "process",
          heading: "How standardised your processes are",
          paragraphs: [
            "AI performs consistently only when the process itself can be described. If one task is done five different ways across departments, converging the process matters more than choosing a tool.",
          ],
        },
        {
          id: "roles",
          heading: "Who owns what",
          paragraphs: [
            "Name the people who maintain the knowledge base, define the behavioural rules, and sign off on output quality. A system with no owner loses accuracy quickly.",
          ],
        },
      ],
    },
    {
      title: "How a RAG system keeps every citation traceable",
      slug: "traceable-rag-citations",
      excerpt:
        "A walk through Dobby's retrieval and verification pipeline, where every answer traces back to its source document.",
      category: "engineering",
      publishedAt: "2026-06-04",
      readTime: "10 min",
      body: [
        {
          id: "s1",
          heading: "Why this matters",
          paragraphs: [
            "When an AI answer is used to support a real decision, where the answer came from matters as much as the answer itself. Dobby's RAG system treats traceability as a first design principle rather than a feature bolted on later.",
          ],
        },
        {
          id: "s2",
          heading: "The retrieval pipeline",
          paragraphs: [
            "Documents pass through format recognition, content normalisation and semantic parsing before becoming retrievable knowledge fragments. Each fragment keeps its position in the source file, so any answer can be traced to a specific page and paragraph.",
          ],
        },
        {
          id: "s3",
          heading: "How verification is designed",
          paragraphs: [
            "Critical scenarios can enable dual-model verification: two models answer independently and their results are compared. Only a match counts as high confidence; anything else is handed back to the user to confirm.",
          ],
        },
        {
          id: "s4",
          heading: "Practical advice",
          paragraphs: [
            "Start with a single high-frequency use case. Once citation accuracy meets expectations there, widen it to cross-department knowledge-base queries.",
          ],
        },
      ],
    },
    {
      title: "Dual-model verification in practice",
      slug: "dual-model-verification",
      excerpt:
        "In high-stakes decisions, two models checking each other beats one model alone.",
      category: "engineering",
      publishedAt: "2026-05-22",
      readTime: "7 min",
      body: [
        {
          id: "why",
          heading: "Why a second model helps",
          paragraphs: [
            "A single model's errors tend to be consistent — it states the wrong answer with the same confidence as the right one. Add a second, independent model and the disagreement itself becomes a usable signal.",
          ],
        },
        {
          id: "how",
          heading: "How the comparison works",
          paragraphs: [
            "Both models retrieve and generate separately, then the system compares their cited sources and conclusions. A match is flagged high-confidence; a mismatch keeps both results and asks the user to decide.",
          ],
        },
      ],
    },
    {
      title: "Case study: cross-checking cut from 30 minutes to 30 seconds",
      slug: "cross-check-case-study",
      excerpt:
        "How one company redesigned its document comparison process around Dobby AI.",
      category: "case-studies",
      publishedAt: "2026-05-09",
      readTime: "5 min",
      body: [
        {
          id: "before",
          heading: "Before",
          paragraphs: [
            "The team manually checked and cross-referenced dozens of documents every day. Each pass took about 30 minutes, and results varied between reviewers.",
          ],
        },
        {
          id: "after",
          heading: "After",
          paragraphs: [
            "With a pipeline tuned to their document types, the same comparison finishes in under 30 seconds at 99% accuracy. More importantly, the team now has a knowledge base that keeps compounding.",
          ],
        },
      ],
    },
    {
      title: "Why open-source tools don't replace real data governance",
      slug: "open-source-vs-governance",
      excerpt: "Weighing freedom against what it costs to maintain.",
      category: "engineering",
      publishedAt: "2026-04-27",
      readTime: "9 min",
      body: [
        {
          id: "freedom",
          heading: "Open source gives you freedom, not a finished product",
          paragraphs: [
            "Open tooling keeps your options open, but dependency management, data-processing quality and long-term maintenance still take time. Those costs usually surface about six months in.",
          ],
        },
        {
          id: "tradeoff",
          heading: "Making the call",
          paragraphs: [
            "If your IT team's hours are better spent on business problems, starting from something that already handles these details pays for itself. If the team has room, building it yourself is a reasonable choice too.",
          ],
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------
   Accessors — Sanity first, seed content as the fallback.
   ------------------------------------------------------------------ */

export async function getSiteSettings(locale: Locale): Promise<SiteSettings> {
  const remote = await sanityFetch<SiteSettings>(siteSettingsQuery, { locale });
  return remote?.name ? { ...SITE[locale], ...remote } : SITE[locale];
}

export async function getCategories(locale: Locale): Promise<Category[]> {
  const remote = await sanityFetch<Category[]>(categoriesQuery, { locale });
  return remote?.length ? remote : CATEGORIES[locale];
}

export async function getCategory(
  slug: string,
  locale: Locale,
): Promise<Category | null> {
  const remote = await sanityFetch<Category>(categoryQuery, { slug, locale });
  return remote ?? CATEGORIES[locale].find((c) => c.slug === slug) ?? null;
}

export async function getPosts(locale: Locale): Promise<Post[]> {
  const remote = await sanityFetch<Post[]>(postsQuery, { locale });
  if (remote?.length) return remote;
  return [...POSTS[locale]].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

export async function getPost(
  slug: string,
  locale: Locale,
): Promise<Post | null> {
  const remote = await sanityFetch<Post>(postQuery, { slug, locale });
  return remote ?? POSTS[locale].find((p) => p.slug === slug) ?? null;
}

export async function getPostsByCategory(
  slug: string,
  locale: Locale,
): Promise<Post[]> {
  const remote = await sanityFetch<Post[]>(postsByCategoryQuery, {
    slug,
    locale,
  });
  if (remote?.length) return remote;
  const posts = await getPosts(locale);
  return posts.filter((p) => p.category === slug);
}

export async function getAuthor(
  locale: Locale,
  slug = AUTHOR[locale].slug,
): Promise<Author | null> {
  const remote = await sanityFetch<Author>(authorQuery, { slug, locale });
  return remote ?? (slug === AUTHOR[locale].slug ? AUTHOR[locale] : null);
}

/** Resolves a post's category record, falling back to the first category. */
export function resolveCategory(
  categories: Category[],
  slug: string,
): Category {
  return categories.find((c) => c.slug === slug) ?? categories[0];
}
