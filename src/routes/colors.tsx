import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useI18n, formatPrice } from "@/lib/i18n";
import { colorsQuery } from "@/lib/catalog";

export const Route = createFileRoute("/colors")({
  head: () => ({
    meta: [
      { title: "Barvy — MERAK svíčky" },
      {
        name: "description",
        content: "Deset jemných odstínů vosku — krémová, pudrová růžová, teplá hnědá a další.",
      },
      { property: "og:title", content: "Barvy — MERAK svíčky" },
      { property: "og:description", content: "Deset jemných odstínů pro tvoji svíčku." },
      { property: "og:url", content: "/colors" },
    ],
    links: [{ rel: "canonical", href: "/colors" }],
  }),
  component: ColorsPage,
});

function ColorsPage() {
  const { t, locale, pick } = useI18n();
  const { data: colors } = useQuery(colorsQuery);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl md:text-5xl">{t("colors.title")}</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">{t("colors.intro")}</p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(colors ?? []).map((color) => (
          <article
            key={color.id}
            className="flex gap-4 rounded-lg border border-border bg-card p-5 shadow-soft"
          >
            <span
              className="size-16 shrink-0 rounded-full border border-border"
              style={{ backgroundColor: color.hex }}
              aria-hidden
            />
            <div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-xl">{pick(color, "name")}</h2>
                {color.price_delta > 0 && (
                  <span className="text-xs text-muted-foreground">
                    +{formatPrice(color.price_delta, locale)}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{pick(color, "description")}</p>
              {color.stock <= 0 && <p className="mt-2 text-xs text-destructive">{t("config.soldOut")}</p>}
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
