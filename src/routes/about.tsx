import { createFileRoute, Link } from "@tanstack/react-router";
import studioImage from "@/assets/about-studio.jpg";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "O nás — MERAK svíčky" },
      {
        name: "description",
        content: "Příběh značky MERAK: ručně lité sójové svíčky vyráběné v malých sériích v Česku.",
      },
      { property: "og:title", content: "O nás — MERAK svíčky" },
      { property: "og:description", content: "Ručně lité sójové svíčky z malé české dílny." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl md:text-5xl">{t("about.title")}</h1>
      <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
        <div className="space-y-5 text-muted-foreground">
          <p>{t("home.story.text")}</p>
          <p>{t("footer.handmade")}</p>
          <p>{t("gifts.intro")}</p>
          <Button asChild className="mt-2">
            <Link to="/create">{t("common.create")}</Link>
          </Button>
        </div>
        <img
          src={studioImage}
          alt="Dílna MERAK svíčky — ruční lití sójového vosku"
          className="rounded-2xl object-cover shadow-soft"
          loading="lazy"
        />
      </div>
    </div>
  );
}
