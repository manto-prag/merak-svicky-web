import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CandlePreview } from "@/components/CandlePreview";
import { useI18n, formatPrice } from "@/lib/i18n";
import { packagingsQuery } from "@/lib/catalog";
import { packagingImage } from "@/lib/packaging-images";

export const Route = createFileRoute("/packaging")({
  head: () => ({
    meta: [
      { title: "Obaly — MERAK svíčky" },
      {
        name: "description",
        content: "Sklo, keramika, plechovka nebo dárková krabička — vyber obal pro svoji svíčku.",
      },
      { property: "og:title", content: "Obaly — MERAK svíčky" },
      { property: "og:description", content: "Deset obalů pro tvoji ručně dělanou svíčku." },
      { property: "og:url", content: "/packaging" },
    ],
    links: [{ rel: "canonical", href: "/packaging" }],
  }),
  component: PackagingPage,
});

function PackagingPage() {
  const { t, locale, pick } = useI18n();
  const { data: packagings } = useQuery(packagingsQuery);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl md:text-5xl">{t("packaging.title")}</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">{t("packaging.intro")}</p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(packagings ?? []).map((packaging) => (
          <article key={packaging.id} className="rounded-lg border border-border bg-card p-6 shadow-soft">
            {packagingImage(packaging.slug) ? (
              <img
                src={packagingImage(packaging.slug)}
                alt={pick(packaging, "name")}
                loading="lazy"
                className="mx-auto aspect-square w-full max-w-56 rounded-lg object-cover"
              />
            ) : (
              <CandlePreview hex="#f0e4db" vesselStyle={packaging.vessel_style} className="mx-auto w-32" />
            )}
            <div className="mt-4 flex items-baseline justify-between gap-3">
              <h2 className="text-xl">{pick(packaging, "name")}</h2>
              {packaging.price_delta > 0 && (
                <span className="text-xs text-muted-foreground">
                  +{formatPrice(packaging.price_delta, locale)}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{pick(packaging, "description")}</p>
            {packaging.stock <= 0 && (
              <p className="mt-2 text-xs text-destructive">{t("config.soldOut")}</p>
            )}
          </article>
        ))}
      </div>

      <Button asChild size="lg" className="mt-12">
        <Link to="/create">{t("common.create")}</Link>
      </Button>
    </div>
  );
}
