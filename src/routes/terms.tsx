import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Obchodní podmínky — MERAK svíčky" },
      { name: "description", content: "Obchodní podmínky nákupu ručně vyráběných svíček MERAK." },
      { property: "og:title", content: "Obchodní podmínky — MERAK svíčky" },
      { property: "og:description", content: "Podmínky objednávky, platby a dodání." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => (
    <LegalPage
      title={{ cs: "Obchodní podmínky", en: "Terms & Conditions" }}
      sections={[
        {
          title: { cs: "Prodávající", en: "Seller" },
          body: {
            cs: "Svíčky Merák, Argentinská 194/12, Praha 7, 17000, IČO: 17645018. Ručně vyráběné sójové svíčky. Kontakt: svicky.merak@email.cz, svicky-merak.cz.",
            en: "Svíčky Merák, Argentinská 194/12, Praha 7, 17000, ID No.: 17645018. Handmade soy candles. Contact: svicky.merak@email.cz, svicky-merak.cz.",
          },
        },
        {
          title: { cs: "Objednávka", en: "Ordering" },
          body: {
            cs: "Objednávka vzniká odesláním formuláře v pokladně. Každá svíčka se vyrábí na zakázku podle zvolené vůně, barvy a obalu. Potvrzení objednávky spolu s platebními údaji obdržíš e-mailem.",
            en: "An order is created by submitting the checkout form. Every candle is made to order from the selected scent, colour and vessel. You will receive a confirmation e-mail with payment details.",
          },
        },
        {
          title: { cs: "Platba", en: "Payment" },
          body: {
            cs: "Platí se předem bankovním převodem nebo QR platbou. Objednávku expedujeme po připsání částky na účet, obvykle do 3–5 pracovních dnů.",
            en: "Payment is made in advance by bank transfer or QR payment. Orders ship once the payment arrives, usually within 3–5 working days.",
          },
        },
        {
          title: { cs: "Doprava", en: "Shipping" },
          body: {
            cs: "Doručujeme na výdejní místa Zásilkovny po ČR. Cena dopravy je uvedena v košíku, nad stanovenou částku je doprava zdarma.",
            en: "We deliver to Zásilkovna pickup points across Czechia. Shipping cost is shown in the cart and is free above the stated order value.",
          },
        },
      ]}
    />
  ),
});
