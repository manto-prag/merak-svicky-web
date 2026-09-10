import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-candle.jpg";
import giftsImage from "@/assets/gifts.jpg";
import studioImage from "@/assets/about-studio.jpg";
import { Button } from "@/components/ui/button";
import { useI18n, formatPrice } from "@/lib/i18n";
import { scentsQuery, colorsQuery, settingsQuery } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MERAK svíčky — vytvoř si vlastní ručně dělanou svíčku" },
      {
        name: "description",
        content:
          "Sójové svíčky ručně vyráběné v Česku. Vyber vůni, barvu a obal a vytvoř si svíčku přesně podle sebe.",
      },
      { property: "og:title", content: "MERAK svíčky — vytvoř si vlastní svíčku" },
      {
        property: "og:description",
        content: "1 000 kombinací vůní, barev a obalů. Ručně vyráběno v malých sériích.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const { t, locale, pick } = useI18n();
  const { data: scents } = useQuery(scentsQuery);
  const { data: colors } = useQuery(colorsQuery);
  const { data: settings } = useQuery(settingsQuery);

  const steps = [1, 2, 3, 4] as const;

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div className="animate-rise">
            <p className="eyebrow">MERAK svíčky</p>
            <h1 className="mt-4 text-5xl leading-[1.05] md:text-6xl">{t("hero.tagline")}</h1>
            <p className="mt-6 max-w-md text-muted-foreground">{t("hero.sub")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link to="/create">
                  {t("hero.cta")} <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              {settings && (
                <span className="text-sm text-muted-foreground">
                  {t("common.from")} {formatPrice(settings.base_price, locale)}
                </span>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-soft">
              <img
                src={heroImage}
                alt="Ručně vyráběná sójová svíčka MERAK v jemném denním světle"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-3xl md:text-4xl">{t("home.how.title")}</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-4">
            {steps.map((step) => (
              <div key={step} className="text-center">
                <span className="mx-auto flex size-11 items-center justify-center rounded-full border border-gold/60 font-display text-lg text-foreground">
                  {step}
                </span>
                <h3 className="mt-4 text-xl">{t(`home.how.${step}.title` as const)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(`home.how.${step}.text` as const)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl md:text-4xl">{t("home.scents.title")}</h2>
          <Link to="/scents" className="text-sm text-muted-foreground hover:text-foreground">
            {t("home.scents.cta")}
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(scents ?? []).slice(0, 4).map((scent) => (
            <article key={scent.id} className="rounded-lg border border-border bg-card p-6 shadow-soft">
              <h3 className="text-2xl">{pick(scent, "name")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{pick(scent, "notes")}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl md:text-4xl">{t("home.colors.title")}</h2>
          <Link to="/colors" className="text-sm text-muted-foreground hover:text-foreground">
            {t("common.select")}
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {(colors ?? []).map((color) => (
            <div key={color.id} className="text-center">
              <span
                className="block size-14 rounded-full border border-border"
                style={{ backgroundColor: color.hex }}
                aria-hidden
              />
              <span className="mt-2 block text-xs text-muted-foreground">{pick(color, "name")}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
          <img
            src={giftsImage}
            alt="Dárkové balení svíček MERAK se stuhou a přáním"
            className="rounded-2xl object-cover shadow-soft"
            loading="lazy"
          />
          <div>
            <h2 className="text-3xl md:text-4xl">{t("home.gifts.title")}</h2>
            <p className="mt-4 text-muted-foreground">{t("home.gifts.text")}</p>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/gifts">{t("home.gifts.cta")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
        <div>
          <h2 className="text-3xl md:text-4xl">{t("home.story.title")}</h2>
          <p className="mt-4 text-muted-foreground">{t("home.story.text")}</p>
          <Button asChild variant="ghost" className="mt-6 px-0">
            <Link to="/about">
              {t("nav.about")} <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
        <img
          src={studioImage}
          alt="Dílna MERAK svíčky s formami a sójovým voskem"
          className="rounded-2xl object-cover shadow-soft"
          loading="lazy"
        />
      </section>
    </div>
  );
}
