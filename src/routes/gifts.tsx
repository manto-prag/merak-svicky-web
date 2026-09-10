import { createFileRoute, Link } from "@tanstack/react-router";
import { Gift, Heart, Sparkles } from "lucide-react";
import giftsImage from "@/assets/gifts.jpg";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/gifts")({
  head: () => ({
    meta: [
      { title: "Dárky — MERAK svíčky" },
      {
        name: "description",
        content: "Osobní dárek s vlastním vzkazem: svíčka na míru v dárkovém balení MERAK.",
      },
      { property: "og:title", content: "Dárky — MERAK svíčky" },
      { property: "og:description", content: "Svíčka na míru jako osobní dárek s vlastním vzkazem." },
      { property: "og:url", content: "/gifts" },
    ],
    links: [{ rel: "canonical", href: "/gifts" }],
  }),
  component: GiftsPage,
});

function GiftsPage() {
  const { t } = useI18n();
  const items = [
    { Icon: Heart, key: "home.how.2.text" },
    { Icon: Gift, key: "home.how.3.text" },
    { Icon: Sparkles, key: "home.how.4.text" },
  ] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl md:text-5xl">{t("gifts.title")}</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">{t("gifts.intro")}</p>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <img
          src={giftsImage}
          alt="Dárkové balení svíčky MERAK se stuhou"
          className="rounded-2xl object-cover shadow-soft"
          loading="lazy"
        />
        <div>
          <p className="text-muted-foreground">{t("gifts.use")}</p>
          <ul className="mt-6 space-y-4">
            {items.map(({ Icon, key }) => (
              <li key={key} className="flex items-start gap-3">
                <Icon className="mt-1 size-5 text-gold" />
                <span className="text-sm text-muted-foreground">{t(key)}</span>
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-8">
            <Link to="/create">{t("common.create")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
