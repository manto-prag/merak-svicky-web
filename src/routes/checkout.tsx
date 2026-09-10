import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n, formatPrice } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { pickupPointsQuery, settingsQuery } from "@/lib/catalog";
import { createOrder } from "@/lib/orders.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Pokladna — MERAK svíčky" },
      { name: "description", content: "Dokonči objednávku svíček MERAK a zaplať převodem nebo QR kódem." },
      { property: "og:title", content: "Pokladna — MERAK svíčky" },
      { property: "og:description", content: "Doručení na výdejní místo Zásilkovny, platba QR kódem." },
      { property: "og:url", content: "/checkout" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/checkout" }],
  }),
  component: CheckoutPage,
});

const formSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(40),
  pickupPoint: z.string().trim().min(3).max(200),
  note: z.string().trim().max(500),
});

function CheckoutPage() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const { lines, subtotal, clear } = useCart();
  const { data: settings } = useQuery(settingsQuery);
  const { data: points } = useQuery(pickupPointsQuery);
  const submitOrder = useServerFn(createOrder);

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    pickupPoint: "",
    note: "",
  });
  const [customPoint, setCustomPoint] = useState("");
  const [sending, setSending] = useState(false);

  const shipping =
    settings && subtotal > 0 ? (subtotal >= settings.free_shipping_from ? 0 : settings.shipping_price) : 0;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const pickupPoint = form.pickupPoint === "__other" ? customPoint : form.pickupPoint;
    const parsed = formSchema.safeParse({ ...form, pickupPoint });
    if (!parsed.success) {
      toast.error(t("common.required"));
      return;
    }
    setSending(true);
    try {
      const order = await submitOrder({
        data: {
          ...parsed.data,
          locale,
          lines: lines.map((line) => ({
            packagingId: line.packagingId,
            scentId: line.scentId,
            colorId: line.colorId,
            message: line.message,
            quantity: line.quantity,
          })),
        },
      });
      clear();
      void navigate({
        to: "/order/$number",
        params: { number: order.orderNumber },
        search: { e: parsed.data.email },
      });
    } catch (error) {
      console.error(error);
      toast.error(t("common.error"));
    } finally {
      setSending(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-3xl">{t("cart.empty")}</h1>
        <Button asChild className="mt-6">
          <Link to="/create">{t("cart.continue")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl md:text-5xl">{t("checkout.title")}</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="customerName">{t("checkout.name")}</Label>
            <Input
              id="customerName"
              required
              maxLength={100}
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="email">{t("checkout.email")}</Label>
              <Input
                id="email"
                type="email"
                required
                maxLength={255}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">{t("checkout.phone")}</Label>
              <Input
                id="phone"
                required
                maxLength={40}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>{t("checkout.pickup")}</Label>
            <Select value={form.pickupPoint} onValueChange={(value) => setForm({ ...form, pickupPoint: value })}>
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
            {form.pickupPoint === "__other" && (
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
            <Label htmlFor="note">{t("checkout.note")}</Label>
            <Textarea
              id="note"
              rows={3}
              maxLength={500}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </div>

          <p className="text-xs text-muted-foreground">{t("checkout.consent")}</p>

          <Button type="submit" size="lg" disabled={sending}>
            {sending ? t("checkout.sending") : t("checkout.submit")}
          </Button>
        </form>

        <aside className="h-fit rounded-xl border border-border bg-card p-6 shadow-soft">
          <p className="eyebrow">{t("checkout.summary")}</p>
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map((line) => (
              <li key={line.lineId} className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  {line.scentName[locale]} · {line.packagingName[locale]} × {line.quantity}
                </span>
                <span>{formatPrice(line.unitPrice * line.quantity, locale)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-3 text-sm text-muted-foreground">
            <span>{t("cart.shipping")}</span>
            <span>{shipping === 0 ? t("cart.freeShipping") : formatPrice(shipping, locale)}</span>
          </div>
          <div className="mt-2 flex justify-between text-lg">
            <span>{t("cart.total")}</span>
            <strong>{formatPrice(subtotal + shipping, locale)}</strong>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">{t("checkout.paymentInfo")}</p>
        </aside>
      </div>
    </div>
  );
}
