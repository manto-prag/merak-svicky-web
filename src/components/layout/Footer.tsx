import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Globe, Instagram, Mail, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { settingsQuery } from "@/lib/catalog";
import { COMPANY } from "@/lib/company";
import { FooterQrCodes } from "@/components/FooterQrCodes";

export function Footer() {
  const { t } = useI18n();
  const { data: settings } = useQuery(settingsQuery);

  return (
    <footer className="mt-24 border-t border-border bg-secondary/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl tracking-[0.24em]">MERAK</p>
          <p className="mt-3 text-sm text-muted-foreground">{t("footer.handmade")}</p>
        </div>

        <div>
          <p className="eyebrow">{t("footer.shop")}</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/create" className="hover:text-foreground">
                {t("nav.create")}
              </Link>
            </li>
            <li>
              <Link to="/scents" className="hover:text-foreground">
                {t("nav.scents")}
              </Link>
            </li>
            <li>
              <Link to="/colors" className="hover:text-foreground">
                {t("nav.colors")}
              </Link>
            </li>
            <li>
              <Link to="/packaging" className="hover:text-foreground">
                {t("nav.packaging")}
              </Link>
            </li>
            <li>
              <Link to="/gifts" className="hover:text-foreground">
                {t("nav.gifts")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">{t("footer.legal")}</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/terms" className="hover:text-foreground">
                {t("legal.terms")}
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-foreground">
                {t("legal.privacy")}
              </Link>
            </li>
            <li>
              <Link to="/returns" className="hover:text-foreground">
                {t("legal.returns")}
              </Link>
            </li>
            <li>
              <Link to="/cookies" className="hover:text-foreground">
                {t("legal.cookies")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">{t("footer.contact")}</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="size-4" />
              <a href={`mailto:${COMPANY.email}`} className="hover:text-foreground">
                {COMPANY.email}
              </a>
            </li>
            {settings?.contact_phone ? (
              <li className="flex items-center gap-2">
                <Phone className="size-4" />
                <a href={`tel:${settings.contact_phone.replace(/\s/g, "")}`} className="hover:text-foreground">
                  {settings.contact_phone}
                </a>
              </li>
            ) : null}
            <li className="flex items-center gap-2">
              <Globe className="size-4" />
              <a href={COMPANY.webUrl} className="hover:text-foreground" rel="noreferrer noopener">
                {COMPANY.web}
              </a>
            </li>
            <li className="flex items-center gap-2">
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
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 border-t border-border/70 px-4 py-10 sm:px-6 md:grid-cols-2">
        <div>
          <p className="eyebrow">{t("footer.company")}</p>
          <address className="mt-4 space-y-1 text-sm not-italic text-muted-foreground">
            <p className="text-foreground">{COMPANY.name}</p>
            <p>{COMPANY.street}</p>
            <p>{COMPANY.city}</p>
            <p>IČO: {COMPANY.ico}</p>
          </address>
        </div>
        <FooterQrCodes />
      </div>


      <div className="border-t border-border/70 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} MERAK svíčky — {t("footer.rights")}
      </div>
    </footer>
  );
}
