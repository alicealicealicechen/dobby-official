import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { getSiteSettings } from "@/lib/content";

export default async function NotFound() {
  const site = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <Header nav={site.nav} />

      <main className="flex flex-1 flex-col items-center justify-center px-8 py-20 text-center">
        <p
          aria-hidden
          className="m-0 text-[clamp(4rem,10vw,7rem)] leading-none font-extrabold tracking-[-0.03em] text-sage-200"
        >
          404
        </p>
        <Icon
          name="closeCircle"
          size={36}
          className="my-3 text-muted opacity-50"
        />
        <h1 className="m-0 mb-3 text-[clamp(1.5rem,3vw,2rem)] font-bold text-ink">
          找不到這個頁面
        </h1>
        <p className="m-0 mb-8 max-w-[420px] text-[15px] leading-[1.7] text-secondary">
          您要找的頁面可能已經移動或不存在，請確認網址，或回到首頁重新開始。
        </p>
        <Button href="/" size="md">
          返回首頁
        </Button>
      </main>

      <Footer />
    </div>
  );
}
