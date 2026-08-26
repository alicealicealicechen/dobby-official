import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import BlogIndex from "@/components/BlogIndex";
import { getAuthor, getCategories, getPosts, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "部落格",
  description: "地端 AI 導入的實務觀點與案例分享。",
};

export default async function BlogListPage() {
  const [site, posts, categories, author] = await Promise.all([
    getSiteSettings(),
    getPosts(),
    getCategories(),
    getAuthor(),
  ]);

  return (
    <>
      <Header nav={site.nav} active="blog" />
      <Breadcrumb
        baseUrl={site.url}
        items={[{ label: "首頁", href: "/" }, { label: "部落格" }]}
      />
      <main>
        <BlogIndex
          posts={posts}
          categories={categories}
          authorName={author?.name ?? site.name}
        />
      </main>
      <Footer />
    </>
  );
}
