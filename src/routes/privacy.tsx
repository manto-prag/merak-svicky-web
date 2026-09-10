import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Ochrana osobních údajů — MERAK svíčky" },
      { name: "description", content: "Jak MERAK svíčky zpracovávají osobní údaje zákazníků." },
      { property: "og:title", content: "Ochrana osobních údajů — MERAK svíčky" },
      { property: "og:description", content: "Zpracování osobních údajů podle GDPR." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: () => (
    <LegalPage
      title={{ cs: "Ochrana osobních údajů", en: "Privacy Policy" }}
      sections={[
        {
          title: { cs: "Jaké údaje zpracováváme", en: "What we process" },
          body: {
            cs: "Jméno, e-mail, telefon a zvolené výdejní místo. Tyto údaje potřebujeme k vyřízení objednávky a k tomu, abychom tě informovali o jejím stavu.",
            en: "Name, e-mail, phone number and the chosen pickup point. We need this data to fulfil your order and keep you informed about it.",
          },
        },
        {
          title: { cs: "Jak dlouho", en: "Retention" },
          body: {
            cs: "Údaje k objednávkám uchováváme po dobu vyžadovanou účetními předpisy. Poté je mažeme.",
            en: "Order data is kept for the period required by accounting law and deleted afterwards.",
          },
        },
        {
          title: { cs: "Tvoje práva", en: "Your rights" },
          body: {
            cs: "Máš právo na přístup k údajům, jejich opravu, výmaz a na podání námitky. Stačí napsat na náš kontaktní e-mail.",
            en: "You have the right to access, correct, delete your data and to object. Just write to our contact e-mail.",
          },
        },
      ]}
    />
  ),
});
