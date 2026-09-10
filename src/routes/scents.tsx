import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useI18n, formatPrice } from "@/lib/i18n";
import { scentImage } from "@/lib/scent-images";
import { scentsQuery } from "@/lib/catalog";

export const Route = createFileRoute("/scents")({
  head: () => ({
    meta: [
      { title: "Vůně — MERAK svíčky" },
      {
        name: "description",
        content: "Deset ručně namíchaných vůní pro sójové svíčky MERAK — od citrusů po dřevité tóny.",
      },
      { property: "og:title", content: "Vůně — MERAK svíčky" },
      { property: "og:description", content: "Deset ručně namíchaných vůní pro tvoji svíčku." },
      { property: "og:url", content: "/scents" },
    ],
    links: [{ rel: "canonical", href: "/scents" }],
  }),
  component: ScentsPage,
});

function ScentsPage() {
  const { t, locale, pick } = useI18n();
  const { data: scents, isLoading } = useQuery(scentsQuery);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl md:text-5xl">{t("scents.title")}</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">{t("scents.intro")}</p>

      {isLoading && <p className="mt-10 text-sm text-muted-foreground">{t("common.loading")}</p>}

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(scents ?? []).map((scent) => (
          <article key={scent.id} className="overflow-hidden rounded-lg border border-border bg-card shadow-soft">
            {scentImage(scent.slug) && (
              <img
                src={scentImage(scent.slug)}
                alt={pick(scent, "name")}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
            )}
            <div className="p-6">
            <div className="flex items-baseline justify-between gap-3">

              <h2 className="text-2xl">{pick(scent, "name")}</h2>
              {scent.price_delta > 0 && (
                <span className="text-xs text-muted-foreground">
                  +{formatPrice(scent.price_delta, locale)}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {pick(scent, "notes")}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">{pick(scent, "description")}</p>
            {scent.stock <= 0 && (
              <p className="mt-3 text-xs text-destructive">{t("config.soldOut")}</p>
            )}
            </div>
          </article>

        ))}
      </div>

      <Button asChild size="lg" className="mt-12">
        <Link to="/create">{t("common.create")}</Link>
      </Button>
    </div>
  );
}
