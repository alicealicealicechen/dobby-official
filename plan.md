# 網站建置計畫:Next.js + Sanity + Vercel

> 前提:前端(Next.js)已大致完成。本計畫聚焦於接入 Sanity CMS、補齊 SEO 技術層、建立行銷自助發佈流程、上線驗證。
> 團隊假設:2-3 人小型工程團隊 + 行銷人員
> 預估總時程:**4-6 週**

---

## 整體時程總覽

| 階段 | 內容 | 時間 | 負責人 |
|---|---|---|---|
| Phase 0 | 帳號與環境建置 | 0.5 週 | 工程 |
| Phase 1 | Sanity 內容模型設計 | 1 週 | 工程 + 行銷 |
| Phase 2 | Next.js 接 Sanity | 1-1.5 週 | 工程 |
| Phase 3 | SEO 技術層實作 | 1 週 | 工程 |
| Phase 4 | 發佈流程 + 行銷自助化 | 0.5 週 | 工程 |
| Phase 5 | 上線前檢查 + 正式上線 | 0.5-1 週 | 全員 |

---

## Phase 0:帳號與環境建置(0.5 週)

### 任務清單

- [x] 註冊 Sanity 帳號,建立專案(Free 方案起步)
- [x] Vercel 專案確認(已有前端 repo 即可直接連)
- [ ] 網域 DNS 指向 Vercel(A record / CNAME,約 10 分鐘)
- [x] 建立三個環境:`production` / `preview`(Vercel PR 自動產生)/ 本地開發
- [ ] Sanity 建立兩個 dataset:`production` 與 `staging`
- [ ] 設定環境變數:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET`
  - `SANITY_API_READ_TOKEN`(preview 草稿用)

### 產出

- 空的 Sanity 專案
- 網域已連上 Vercel,HTTPS 自動生效

---

## Phase 1:Sanity 內容模型設計(1 週)⭐ 成敗關鍵

> 內容模型(content model)設計錯誤會導致後面全部重工。
> **必須拉行銷一起開會定案**,不要工程師自己決定。

### 要定義的 Content Types(Schema)

#### 1. `page` — 一般頁面

| 欄位 | 型別 | 說明 |
|---|---|---|
| title | string | 頁面名稱 |
| slug | slug | URL 後綴,行銷可編輯 |
| sections | array | 可組合的頁面區塊(hero、feature、CTA 等) |
| seo | object | 共用 SEO 欄位(見下方) |

#### 2. `post` — 部落格文章

| 欄位 | 型別 | 說明 |
|---|---|---|
| title | string | 文章標題 |
| slug | slug | URL 後綴 |
| author | reference | 關聯到 author |
| categories | array of reference | 關聯到 category |
| publishedAt | datetime | 發佈時間 |
| mainImage | image | 主圖(含 alt text 欄位) |
| body | portable text | 內文(富文本) |
| seo | object | 共用 SEO 欄位 |

#### 3. `author` — 作者

| 欄位 | 型別 | 說明 |
|---|---|---|
| name | string | 姓名 |
| slug | slug | 作者頁 URL |
| avatar | image | 頭像 |
| bio | text | 簡介 |

#### 4. `category` — 分類

| 欄位 | 型別 | 說明 |
|---|---|---|
| title | string | 分類名稱 |
| slug | slug | 分類頁 URL |
| description | text | 分類描述 |

#### 5. `seo` — 共用 SEO 物件(嵌入所有頁面型別)

| 欄位 | 型別 | 說明 |
|---|---|---|
| metaTitle | string | 頁面標題,建議 ≤ 60 字元 |
| metaDescription | text | 描述,建議 ≤ 160 字元 |
| canonicalUrl | url | 選填,不填則自動生成 |
| ogImage | image | 社群分享圖(1200x630) |
| noIndex | boolean | 是否禁止索引 |

#### 6. `siteSettings` — 全站設定(singleton)

| 欄位 | 型別 | 說明 |
|---|---|---|
| siteName | string | 網站名稱 |
| defaultOgImage | image | 預設分享圖 |
| organizationSchema | object | 公司名稱、Logo、聯絡資訊(給 Organization schema 用) |
| redirects | array | 301 轉址清單(from / to) |

### 任務清單

- [ ] 與行銷開 workshop,盤點所有頁面類型與欄位需求  
      ↳ 尚未進行。目前的 schema 是給這場會議用的草稿,不是定案。
- [x] 用 Sanity schema(TypeScript)定義以上 content types  
      ↳ 已在 `src/sanity/schemaTypes/index.ts`,含 page/post/author/category/seo/siteSettings 與 language 欄位。寫成純物件,待安裝 `sanity` 後再包 defineType。
- [x] 設定欄位驗證(如 metaTitle 長度警告)  
      ↳ metaTitle ≤ 60、metaDescription ≤ 160、language 必填。
- [ ] 部署 Sanity Studio(可部署到 `yourcompany.sanity.studio` 或掛在 Next.js 的 `/studio` 路由)
- [ ] 行銷試用 Studio,回饋欄位命名與順序調整

### 產出

- 完整可用的 Sanity Studio 後台
- 行銷確認過的內容模型

---

## Phase 2:Next.js 接 Sanity(1-1.5 週)

### 任務清單

- [x] 安裝 `next-sanity` 套件,設定 client  
      ↳ `src/lib/sanity.ts`。未設 `NEXT_PUBLIC_SANITY_PROJECT_ID` 時查詢回傳 null,由種子內容遞補,所以 CMS 建好前網站就能跑。
- [x] 撰寫 GROQ query(每個頁面型別一組)  
      ↳ `src/lib/queries.ts`,每一條都以 `language` 過濾(文件級翻譯)。
- [ ] 動態路由接資料:  
      ↳ blog/[slug]、blog/category/[slug]、blog/author/[slug] 已完成;通用的 `app/[slug]` 尚未建立(還沒有 CMS 頁面內容)。
  - `app/[slug]/page.tsx` → page
  - `app/blog/[slug]/page.tsx` → post
  - `app/blog/category/[slug]/page.tsx` → category
  - `app/blog/author/[slug]/page.tsx` → author
- [x] 圖片走 Sanity CDN + `next/image`(自動 WebP、responsive)  
      ↳ `next.config.ts` 已允許 `cdn.sanity.io`;文章主圖走 next/image。
- [ ] Portable Text 渲染元件(內文的標題、圖片、連結、程式碼區塊樣式)  
      ↳ 改用結構化的 `body[]{heading, paragraphs}`,尚未接 Portable Text。若內文要支援圖片/連結/程式碼區塊需改回。
- [x] 渲染策略:  
      ↳ 全部頁面皆 SSG + ISR(`revalidate: 60`),無純 CSR 頁面。
  - 行銷頁與文章:**SSG + ISR**(`revalidate: 60`)
  - 首頁:SSG + ISR
  - 避免純 CSR 頁面
- [ ] Draft Mode(草稿預覽):
  - 建立 `/api/draft` 路由驗證 token
  - Sanity Studio 的 Preview 按鈕連到草稿版頁面
- [ ] 404 / 500 頁面  
      ↳ 404 已完成(雙語、含設計);500 / error boundary 尚未建立。

### 產出

- 所有頁面內容由 Sanity 驅動
- 行銷可在 Studio 內預覽草稿

---

## Phase 3:SEO 技術層實作(1 週)

> 對應原始 SEO 需求文件的技術實作。

### 3.1 Metadata(需求 1.1)

- [x] 每個路由實作 `generateMetadata()`,從 Sanity `seo` 欄位讀取:  
      ↳ 所有路由皆已實作,並含 hreflang alternates 與各語系 canonical。
  - title / description / canonical / OG tags / Twitter tags / robots
- [x] 未填寫時的 fallback 邏輯(用文章標題自動生成)  
      ↳ `post.seo?.metaTitle ?? post.title`,description 同理。

### 3.2 URL 與轉址(需求 1.2)

- [ ] slug 全小寫、連字號格式(Sanity slug 欄位設定 validation)
- [ ] 301 轉址:從 Sanity `siteSettings.redirects` 讀取,在 `next.config.js` 或 middleware 處理
- [ ] 行銷可在 Studio 自行新增轉址規則

### 3.3 Sitemap(需求 1.3)

- [x] `app/sitemap.ts`:自動抓取所有 published 頁面與文章  
      ↳ 與頁面共用同一組存取函式,兩個語系都涵蓋。
- [ ] 含 `lastModified`(用 Sanity `_updatedAt`)  
      ↳ 目前用 `publishedAt`;接上 Sanity 後改讀 `_updatedAt`。
- [x] noIndex 的頁面自動排除

### 3.4 robots.txt(需求 1.4)

- [x] `app/robots.ts`:production 開放、preview 環境自動 `Disallow: /`  
      ↳ 以 `VERCEL_ENV` 判斷。
- [x] 指定 sitemap 位置

### 3.5 結構化資料 Schema(需求 2.3)

- [x] JSON-LD 生成函式,每個型別一組:  
      ↳ `src/lib/schemas.ts`
  - [x] Organization(全站,資料來自 siteSettings)
  - [x] Article(部落格文章)
  - [x] BreadcrumbList(所有頁面)
  - [x] FAQ(若頁面含 FAQ section)
  - [ ] Product(若有產品頁)
- [ ] 用 [Rich Results Test](https://search.google.com/test/rich-results) 驗證

### 3.6 效能 / Core Web Vitals(需求 2.1)

- [x] 全站圖片走 `next/image`
- [x] 字型用 `next/font` 自架(消除 layout shift)  
      ↳ Inter / Noto Sans TC / Roboto Mono,未連 Google Fonts CDN。
- [ ] 第三方腳本用 `<Script strategy="afterInteractive">`
- [ ] Lighthouse 分數目標:Performance ≥ 90、SEO = 100
- [ ] 目標指標:LCP < 2.0s、CLS < 0.1、INP < 200ms

### 3.7 分析追蹤(需求 4)

- [ ] GA4 + Google Tag Manager 安裝(走 GTM 統一管理)
- [ ] Google Search Console 驗證 + 提交 sitemap
- [ ] Cookie 同意機制(若有歐盟流量)

### 產出

- SEO 需求文件 1.1-1.4、2.1、2.3、4 全數落地
- Lighthouse / Rich Results 驗證通過

---

## Phase 4:發佈流程 + 行銷自助化(0.5 週)

### 一鍵發佈機制

- [ ] Vercel 建立 Deploy Hook(Settings → Git → Deploy Hooks)
- [ ] Sanity 設定 Webhook:publish 時 POST 到 Deploy Hook URL
- [ ] 測試:行銷點 Publish → 1-3 分鐘後網站更新

### 選配強化(依團隊需求)

- [ ] Scheduled Publishing 套件(排程發佈)
- [ ] Vercel 部署狀態通知到 Slack
- [ ] Sanity Studio 內嵌「網站建置狀態」顯示

### 行銷教育訓練

- [ ] 1 小時 workshop:建立文章、填 SEO 欄位、預覽草稿、發佈
- [ ] 撰寫一頁式操作 SOP(含常見問題)

### 產出

- 行銷完全自助發佈,不需工程師介入

---

## Phase 5:上線前檢查 + 正式上線(0.5-1 週)

### 內容準備

- [ ] 行銷把首波內容(頁面 + 至少 3-5 篇文章)輸入 Sanity
- [ ] 所有頁面 SEO 欄位填寫完整

### 技術檢查清單

- [ ] 用 Screaming Frog 爬整站:無 404、無重複 title、無孤立頁
- [ ] 所有頁面 `curl` 檢查回傳完整 HTML(確認 SSR/SSG 正常)
- [ ] Rich Results Test 通過(Organization、Article、Breadcrumb)
- [ ] PageSpeed Insights 行動版 Performance ≥ 85
- [ ] 舊網站 URL 對照表 → 301 轉址全部設定(**若是改版遷移,此項最重要**)
- [ ] OG 分享預覽測試(Facebook Debugger、Twitter Card Validator)
- [ ] 手機實機測試(iOS Safari + Android Chrome)

### 上線日

- [ ] DNS 切換(若從舊站遷移)
- [ ] Search Console 提交新 sitemap
- [ ] 若換網域:Search Console 提交網址異動
- [ ] 監控 Search Console 索引狀況(前兩週每天看)

### 上線後兩週

- [ ] 觀察 Core Web Vitals 實際數據(Search Console → 體驗報告)
- [ ] 檢查 404 報告,補漏掉的轉址
- [ ] 確認 GA4 事件正常進資料

---

## 費用預估

| 項目 | 起步 | 成長後 |
|---|---|---|
| Sanity | $0(Free 方案) | ~$99/月(Growth,20 人) |
| Vercel | $0(Hobby)或 $20/月(Pro,商用建議) | $20/月起 |
| 網域 | ~$15/年 | 同左 |
| **月費合計** | **$0-20** | **~$120** |

> 注意:Vercel Hobby 方案禁止商業用途,正式商用請直接用 Pro($20/月)。

---

## 風險與注意事項

1. **內容模型返工風險**:Phase 1 沒做好,Phase 2-3 全部重來。寧可多花兩天開會。
2. **遷移轉址遺漏**:若是舊站改版,漏掉 301 會直接掉排名。上線前務必產出完整 URL 對照表。
3. **Sanity 免費方案限制**:3 個使用者、500K API requests/月。中小型網站夠用,超過再升級。
4. **ISR 快取疑惑**:行銷發佈後若「還看不到更新」,通常是 ISR 快取尚未過期,等 revalidate 秒數或用 webhook 全站 rebuild 即可。先在 SOP 寫清楚,避免行銷恐慌。
5. **Draft 與 Published 混淆**:訓練時強調 Save(存草稿)與 Publish(上線)的差異。

---

## 未來擴充路線(不在本期範圍)

- ~~多語系(next-intl + Sanity 文件級翻譯 + hreflang)~~ — **已提前完成**,但未使用
  next-intl:語系是網址第一段(`/zh`、`/en`),純靜態產生、不需要 middleware。
  介面文字在 `src/lib/i18n.ts`,內容依語系分開存放並以 `language` 過濾,對應
  Sanity 的文件級翻譯。hreflang 與各語系 canonical 已就位。
- A/B testing(Vercel Edge Middleware)
- 站內搜尋(Algolia 或 Pagefind)
- 電子報整合(Resend / Mailchimp)
- AI 搜尋最佳化進階(llms.txt、更多 schema 類型)