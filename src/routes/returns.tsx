import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Vrácení a reklamace — MERAK svíčky" },
      { name: "description", content: "Podmínky vrácení zboží a reklamace svíček MERAK." },
      { property: "og:title", content: "Vrácení a reklamace — MERAK svíčky" },
      { property: "og:description", content: "Jak postupovat při reklamaci nebo vrácení." },
      { property: "og:url", content: "/returns" },
    ],
    links: [{ rel: "canonical", href: "/returns" }],
  }),
  component: () => (
    <LegalPage
      title={{ cs: "Vrácení a reklamace", en: "Returns & Complaints" }}
      sections={[
        {
          title: { cs: "Zboží na míru", en: "Made-to-order goods" },
          body: {
            cs: "Svíčky vyrábíme na zakázku podle tvé konfigurace, proto se na ně nevztahuje zákonné právo na odstoupení do 14 dnů. Pokud si nejsi jistá výběrem, ozvi se nám před objednáním.",
            en: "Candles are made to order from your configuration, so the statutory 14-day withdrawal right does not apply. If you are unsure about your choice, contact us before ordering.",
          },
        },
        {
          title: { cs: "Poškozená zásilka", en: "Damaged parcel" },
          body: {
            cs: "Pokud dorazí svíčka poškozená, pošli nám do 48 hodin fotografii na kontaktní e-mail. Vyrobíme novou nebo vrátíme peníze.",
            en: "If a candle arrives damaged, send us a photo within 48 hours to our contact e-mail. We will remake it or refund you.",
          },
        },
        {
          title: { cs: "Reklamace", en: "Complaints" },
          body: {
            cs: "Na výrobní vady poskytujeme záruku 24 měsíců. Reklamaci vyřídíme do 30 dnů od doručení.",
            en: "We provide a 24-month warranty on manufacturing defects. Complaints are handled within 30 days of receipt.",
          },
        },
      ]}
    />
  ),
});
