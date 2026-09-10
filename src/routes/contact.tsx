import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Globe, Instagram, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";
import { settingsQuery } from "@/lib/catalog";
import { COMPANY } from "@/lib/company";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Kontakt — MERAK svíčky" },
      { name: "description", content: "Napiš nám ohledně objednávky, spolupráce nebo firemních dárků." },
      { property: "og:title", content: "Kontakt — MERAK svíčky" },
      { property: "og:description", content: "Ozvi se nám — rádi poradíme s výběrem svíčky." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useI18n();
  const { data: settings } = useQuery(settingsQuery);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const mailto = `mailto:${COMPANY.email}?subject=${encodeURIComponent(
    `MERAK — ${name.slice(0, 60)}`,
  )}&body=${encodeURIComponent(`${message.slice(0, 1000)}\n\n${name}\n${email}`)}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl md:text-5xl">{t("contact.title")}</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">{t("contact.intro")}</p>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            window.location.href = mailto;
          }}
        >
          <div>
            <Label htmlFor="name">{t("checkout.name")}</Label>
            <Input id="name" required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">{t("checkout.email")}</Label>
            <Input
              id="email"
              type="email"
              required
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="message">{t("contact.message")}</Label>
            <Textarea
              id="message"
              required
              maxLength={1000}
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button type="submit" size="lg">
            {t("contact.send")}
          </Button>
        </form>

        <div className="space-y-6">
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <Mail className="size-4" />
              <a href={`mailto:${COMPANY.email}`} className="hover:text-foreground">
                {COMPANY.email}
              </a>
            </li>
            {settings?.contact_phone ? (
              <li className="flex items-center gap-3">
                <Phone className="size-4" />
                <a href={`tel:${settings.contact_phone.replace(/\s/g, "")}`} className="hover:text-foreground">
                  {settings.contact_phone}
                </a>
              </li>
            ) : null}
            <li className="flex items-center gap-3">
              <Globe className="size-4" />
              <a href={COMPANY.webUrl} className="hover:text-foreground" rel="noreferrer noopener">
                {COMPANY.web}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Instagram className="size-4" />
              <a
                href={settings?.instagram ?? "#"}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-foreground"
              >
                @meraksvicky
              </a>
            </li>
          </ul>

          <address className="space-y-1 text-sm not-italic text-muted-foreground">
            <p className="text-foreground">{COMPANY.name}</p>
            <p>{COMPANY.street}</p>
            <p>{COMPANY.city}</p>
            <p>IČO: {COMPANY.ico}</p>
          </address>
        </div>

      </div>
    </div>
  );
}
