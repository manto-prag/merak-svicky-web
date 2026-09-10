import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";

const links = [
  { to: "/create", key: "nav.create" },
  { to: "/scents", key: "nav.scents" },
  { to: "/colors", key: "nav.colors" },
  { to: "/packaging", key: "nav.packaging" },
  { to: "/gifts", key: "nav.gifts" },
  { to: "/about", key: "nav.about" },
  { to: "/contact", key: "nav.contact" },
] as const;

export function Header() {
  const { t, locale, setLocale } = useI18n();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="font-display text-2xl tracking-[0.24em] text-foreground">
          MERAK
        </Link>

        <nav className="ml-auto hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-4">
          <button
            onClick={() => setLocale(locale === "cs" ? "en" : "cs")}
            className="rounded-sm px-2 py-1 text-xs tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Change language"
          >
            {locale === "cs" ? "EN" : "CZ"}
          </button>

          <Button asChild variant="ghost" size="icon" className="relative">
            <Link to="/cart" aria-label={t("nav.cart")}>
              <ShoppingBag className="size-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-blush text-[10px] font-semibold text-blush-foreground">
                  {count}
                </span>
              )}
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label={t("nav.menu")}>
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="mt-10 flex flex-col gap-1 px-4">
                <Link to="/" onClick={() => setOpen(false)} className="py-3 font-display text-xl">
                  {t("nav.home")}
                </Link>
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="py-3 font-display text-xl"
                  >
                    {t(link.key)}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
