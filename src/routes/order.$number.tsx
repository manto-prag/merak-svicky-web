import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CandlePreview } from "@/components/CandlePreview";
import { useI18n, formatPrice } from "@/lib/i18n";
import { getOrder } from "@/lib/orders.functions";

const searchSchema = z.object({ e: z.string().catch("") });

export const Route = createFileRoute("/order/$number")({
  validateSearch: searchSchema,
  head: ({ params }) => ({
    meta: [
      { title: `Objednávka ${params.number} — MERAK svíčky` },
      { name: "description", content: "Detail objednávky a platební údaje MERAK svíčky." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Objednávka — MERAK svíčky" },
      { property: "og:description", content: "Detail objednávky a platební údaje." },
      { property: "og:url", content: `/order/${params.number}` },
    ],
    links: [{ rel: "canonical", href: `/order/${params.number}` }],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { number } = Route.useParams();
  const { e } = Route.useSearch();
  const { t, locale } = useI18n();
  const [qr, setQr] = useState<string | null>(null);

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", number, e],
    enabled: Boolean(e),
    queryFn: () => getOrder({ data: { orderNumber: number, email: e } }),
  });

  useEffect(() => {
    if (!order) return;
    void QRCode.toDataURL(order.payment.spayd, { margin: 1, width: 320 }).then(setQr);
  }, [order]);

  if (isLoading) {
    return <p className="mx-auto max-w-3xl px-4 py-20 text-muted-foreground">{t("common.loading")}</p>;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-3xl">{t("order.notFound")}</h1>
        <Button asChild className="mt-6">
          <Link to="/">{t("common.back")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="eyebrow">
        {t("order.number")} {order.orderNumber}
      </p>
      <h1 className="mt-2 text-4xl md:text-5xl">{t("order.thanks")}</h1>
      <p className="mt-4 text-muted-foreground">{t("order.emailSent")}</p>

      <section className="mt-10 rounded-xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-2xl">{t("order.payTitle")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("order.payHint")}</p>
        <div className="mt-6 flex flex-wrap items-center gap-8">
          {qr && (
            <img src={qr} alt="QR platba" className="size-44 rounded-lg border border-border bg-background p-2" />
          )}
          <dl className="space-y-2 text-sm">
            <div className="flex gap-3">
              <dt className="w-32 text-muted-foreground">{t("order.account")}</dt>
              <dd>{order.payment.account}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-32 text-muted-foreground">{t("order.iban")}</dt>
              <dd>{order.payment.iban}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-32 text-muted-foreground">{t("order.amount")}</dt>
              <dd>
                <strong>{formatPrice(order.total, locale)}</strong>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-32 text-muted-foreground">{t("order.vs")}</dt>
              <dd>{order.payment.variableSymbol}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl">{t("order.items")}</h2>
        <ul className="mt-4 space-y-3">
          {order.items.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-soft"
            >
              <CandlePreview hex={item.colorHex} className="w-12 shrink-0" />
              <div className="flex-1">
                <p className="font-display text-lg">{item.scent}</p>
                <p className="text-sm text-muted-foreground">
                  {item.packaging} · {item.color} · {item.quantity} {t("cart.pcs")}
                </p>
                {item.message && (
                  <p className="text-xs text-muted-foreground">
                    {t("cart.message")}: „{item.message}“
                  </p>
                )}
              </div>
              <strong>{formatPrice(item.lineTotal, locale)}</strong>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between text-sm text-muted-foreground">
          <span>{t("cart.shipping")}</span>
          <span>
            {order.shippingTotal === 0 ? t("cart.freeShipping") : formatPrice(order.shippingTotal, locale)}
          </span>
        </div>
        <div className="mt-2 flex justify-between text-lg">
          <span>{t("cart.total")}</span>
          <strong>{formatPrice(order.total, locale)}</strong>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          {t("checkout.pickup")}: {order.pickupPoint}
        </p>
      </section>
    </div>
  );
}
