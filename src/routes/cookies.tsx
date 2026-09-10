import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookies — MERAK svíčky" },
      { name: "description", content: "Jak MERAK svíčky používají cookies a místní úložiště." },
      { property: "og:title", content: "Cookies — MERAK svíčky" },
      { property: "og:description", content: "Informace o cookies a lokálním úložišti." },
      { property: "og:url", content: "/cookies" },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  component: () => (
    <LegalPage
      title={{ cs: "Cookies", en: "Cookies" }}
      sections={[
        {
          title: { cs: "Co ukládáme", en: "What we store" },
          body: {
            cs: "Používáme pouze nezbytné technické úložiště prohlížeče: obsah košíku, zvolený jazyk a potvrzení této lišty. Nic z toho neslouží k reklamě.",
            en: "We only use essential browser storage: your cart contents, the chosen language and the acknowledgement of this banner. None of it is used for advertising.",
          },
        },
        {
          title: { cs: "Analytika", en: "Analytics" },
          body: {
            cs: "Nepoužíváme žádné reklamní ani trackovací cookies třetích stran.",
            en: "We do not use any third-party advertising or tracking cookies.",
          },
        },
        {
          title: { cs: "Jak je smazat", en: "How to remove them" },
          body: {
            cs: "Data smažeš vymazáním úložiště webu v nastavení svého prohlížeče.",
            en: "You can delete the data by clearing this site's storage in your browser settings.",
          },
        },
      ]}
    />
  ),
});
