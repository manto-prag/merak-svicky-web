import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CandlePreview } from "@/components/CandlePreview";
import { useI18n, formatPrice } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { pickupPointsQuery, settingsQuery } from "@/lib/catalog";
import { FREE_SHIPPING_FROM_PCS, isFreeShipping, openOrderMail, totalPieces } from "@/lib/order-mail";
import { cn } from "@/lib/utils";


export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Košík — MERAK svíčky" },
      { name: "description", content: "Tvoje vybrané svíčky MERAK připravené k objednání." },
      { property: "og:title", content: "Košík — MERAK svíčky" },
      { property: "og:description", content: "Zkontroluj svoji objednávku svíček na míru." },
      { property: "og:url", content: "/cart" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/cart" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { t, locale } = useI18n();
  const { lines, removeLine, setQuantity, subtotal, hydrated } = useCart();
  const { data: settings } = useQuery(settingsQuery);
  const { data: points } = useQuery(pickupPointsQuery);

  const [pickupPoint, setPickupPoint] = useState("");
  const [customPoint, setCustomPoint] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const pieces = totalPieces(lines);
  const freeShipping = isFreeShipping(pieces);
  const missingPcs = Math.max(0, FREE_SHIPPING_FROM_PCS - pieces);

  const shipping = freeShipping
    ? 0
    : settings && subtotal > 0
      ? subtotal >= settings.free_shipping_from
        ? 0
        : settings.shipping_price
      : 0;

  function handleOrderNow() {
    openOrderMail({
      items: lines.map((line) => ({
        product: "Svíčka na míru",
        packaging: line.packagingName.cs,
        scent: line.scentName.cs,
        color: line.colorName.cs,
        quantity: line.quantity,
        message: line.message,
      })),
      pickupPoint: pickupPoint === "__other" ? customPoint : pickupPoint,
      customerName,
      email,
      phone,
    });
  }


  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl md:text-5xl">{t("cart.title")}</h1>

      {hydrated && lines.length === 0 && (
        <div className="mt-10">
          <p className="text-muted-foreground">{t("cart.empty")}</p>
          <Button asChild className="mt-6">
            <Link to="/create">{t("cart.continue")}</Link>
          </Button>
        </div>
      )}

      {lines.length > 0 && (
        <>
          <ul className="mt-10 space-y-4">
            {lines.map((line) => (
              <li
                key={line.lineId}
                className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-soft"
              >
                <CandlePreview hex={line.colorHex} className="w-14 shrink-0" />
                <div className="min-w-40 flex-1">
                  <p className="font-display text-xl">{line.scentName[locale]}</p>
                  <p className="text-sm text-muted-foreground">
                    {line.packagingName[locale]} · {line.colorName[locale]}
                  </p>
                  {line.message && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("cart.message")}: „{line.message}“
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setQuantity(line.lineId, line.quantity - 1)}>
                    <Minus className="size-4" />
                  </Button>
                  <span className="w-8 text-center text-sm">
                    {line.quantity} {t("cart.pcs")}
                  </span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity(line.lineId, line.quantity + 1)}>
                    <Plus className="size-4" />
                  </Button>
                </div>
                <strong className="w-24 text-right">{formatPrice(line.unitPrice * line.quantity, locale)}</strong>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("cart.remove")}
                  onClick={() => removeLine(line.lineId)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>

          <div
            className={cn(
              "mt-6 rounded-lg border p-4 text-sm",
              freeShipping ? "border-gold bg-secondary/60 text-foreground" : "border-border bg-card text-muted-foreground",
            )}
          >
            <p>
              {t("cart.pieces")}: <strong>{pieces} {t("cart.pcs")}</strong> · {t("ship.rule")}
            </p>
            <p className="mt-1">
              {freeShipping ? t("ship.free") : `${t("ship.addA")} ${missingPcs} ${t("ship.addB")}`}
            </p>
          </div>

          <div className="mt-6 grid gap-4 rounded-lg border border-border bg-card p-6 shadow-soft sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>{t("checkout.pickup")}</Label>
              <Select value={pickupPoint} onValueChange={setPickupPoint}>
                <SelectTrigger>
                  <SelectValue placeholder={t("checkout.pickupPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {(points ?? []).map((point) => (
                    <SelectItem key={point.id} value={`${point.name}, ${point.street}, ${point.zip} ${point.city}`}>
                      {point.name} — {point.city}
                    </SelectItem>
                  ))}
                  <SelectItem value="__other">{t("checkout.pickupOther")}</SelectItem>
                </SelectContent>
              </Select>
              {pickupPoint === "__other" && (
                <Input
                  className="mt-3"
                  maxLength={200}
                  placeholder={t("checkout.pickupPlaceholder")}
                  value={customPoint}
                  onChange={(e) => setCustomPoint(e.target.value)}
                />
              )}
            </div>
            <div>
              <Label htmlFor="cart-name">{t("checkout.name")}</Label>
              <Input id="cart-name" maxLength={100} value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="cart-email">{t("checkout.email")}</Label>
              <Input id="cart-email" type="email" maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="cart-phone">{t("checkout.phone")}</Label>
              <Input id="cart-phone" maxLength={40} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-border bg-card p-6 shadow-soft">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t("cart.subtotal")}</span>
              <span>{formatPrice(subtotal, locale)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-muted-foreground">
              <span>{t("cart.shipping")}</span>
              <span>{shipping === 0 ? t("cart.freeShipping") : formatPrice(shipping, locale)}</span>
            </div>
            <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg">
              <span>{t("cart.total")}</span>
              <strong>{formatPrice(subtotal + shipping, locale)}</strong>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" onClick={handleOrderNow}>
                {t("order.now")}
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/create">{t("cart.keepShopping")}</Link>
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{t("order.nowHint")}</p>
          </div>

        </>
      )}
    </div>
  );
}
