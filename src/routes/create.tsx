import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CandlePreview } from "@/components/CandlePreview";
import { useI18n, formatPrice } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { colorsQuery, packagingsQuery, scentsQuery, settingsQuery } from "@/lib/catalog";
import { scentImage } from "@/lib/scent-images";
import { packagingImage } from "@/lib/packaging-images";
import { openOrderMail, isFreeShipping, FREE_SHIPPING_FROM_PCS } from "@/lib/order-mail";
import { cn } from "@/lib/utils";


export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Vytvoř si svíčku — MERAK svíčky" },
      {
        name: "description",
        content:
          "Konfigurátor svíčky MERAK: vyber obal, vůni a barvu, přidej osobní vzkaz a sleduj cenu živě.",
      },
      { property: "og:title", content: "Vytvoř si svíčku — MERAK svíčky" },
      {
        property: "og:description",
        content: "1 000 kombinací obalů, vůní a barev. Osobní vzkaz na přání.",
      },
      { property: "og:url", content: "/create" },
    ],
    links: [{ rel: "canonical", href: "/create" }],
  }),
  component: Configurator,
});

function Configurator() {
  const { t, locale, pick } = useI18n();
  const navigate = useNavigate();
  const { addLine } = useCart();

  const { data: scents } = useQuery(scentsQuery);
  const { data: colors } = useQuery(colorsQuery);
  const { data: packagings } = useQuery(packagingsQuery);
  const { data: settings } = useQuery(settingsQuery);

  const [packagingId, setPackagingId] = useState<string | null>(null);
  const [scentId, setScentId] = useState<string | null>(null);
  const [colorId, setColorId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const packaging = packagings?.find((p) => p.id === packagingId) ?? null;
  const scent = scents?.find((s) => s.id === scentId) ?? null;
  const color = colors?.find((c) => c.id === colorId) ?? null;

  const recommendedColorId = useMemo(() => {
    if (!scent || !colors) return null;
    return colors.find((c) => c.slug === scent.recommended_color_slug)?.id ?? null;
  }, [scent, colors]);

  /** vybraná vůně automaticky nastaví doporučenou barvu (zákazník ji může změnit) */
  function selectScent(id: string) {
    setScentId(id);
    const next = scents?.find((s) => s.id === id);
    const rec = next ? colors?.find((c) => c.slug === next.recommended_color_slug) : undefined;
    if (rec && rec.stock > 0) setColorId(rec.id);
  }

  useEffect(() => {
    if (!colorId && recommendedColorId) setColorId(recommendedColorId);
  }, [colorId, recommendedColorId]);

  const unitPrice = useMemo(() => {
    if (!settings) return 0;
    return (
      settings.base_price +
      (packaging?.price_delta ?? 0) +
      (scent?.price_delta ?? 0) +
      (color?.price_delta ?? 0) +
      (message.trim() ? settings.personalization_fee : 0)
    );
  }, [settings, packaging, scent, color, message]);

  const complete = Boolean(packaging && scent && color);
  const freeShipping = isFreeShipping(quantity);
  const missingPcs = Math.max(0, FREE_SHIPPING_FROM_PCS - quantity);

  function handleAdd() {
    if (!packaging || !scent || !color) {
      toast.error(t("config.selectAll"));
      return;
    }
    addLine({
      packagingId: packaging.id,
      scentId: scent.id,
      colorId: color.id,
      message: message.trim().slice(0, 150),
      quantity,
      packagingName: { cs: packaging.name_cs, en: packaging.name_en },
      scentName: { cs: scent.name_cs, en: scent.name_en },
      colorName: { cs: color.name_cs, en: color.name_en },
      colorHex: color.hex,
      unitPrice,
    });
    toast.success(t("config.added"));
    void navigate({ to: "/cart" });
  }

  function handleOrderNow() {
    if (!packaging || !scent || !color) {
      toast.error(t("config.selectAll"));
      return;
    }
    openOrderMail({
      items: [
        {
          product: "Svíčka na míru",
          packaging: packaging.name_cs,
          scent: scent.name_cs,
          color: color.name_cs,
          quantity,
          message,
        },
      ],
    });
  }


  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl md:text-5xl">{t("config.title")}</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-12">
          <Step index={1} title={t("config.packaging")}>
            <div className="grid gap-3 sm:grid-cols-2">
              {(packagings ?? []).map((option) => (
                <OptionButton
                  key={option.id}
                  selected={packagingId === option.id}
                  disabled={option.stock <= 0}
                  onClick={() => setPackagingId(option.id)}
                  title={pick(option, "name")}
                  subtitle={pick(option, "description")}
                  extra={
                    option.price_delta > 0 ? `+${formatPrice(option.price_delta, locale)}` : undefined
                  }
                  soldOutLabel={t("config.soldOut")}
                  visual={
                    packagingImage(option.slug) ? (
                      <img
                        src={packagingImage(option.slug)}
                        alt={pick(option, "name")}
                        loading="lazy"
                        className="size-14 shrink-0 rounded-md object-cover"
                      />
                    ) : (
                      <CandlePreview hex={color?.hex ?? "#f0e4db"} vesselStyle={option.vessel_style} className="w-10" />
                    )
                  }
                />
              ))}
            </div>
          </Step>

          <Step index={2} title={t("config.scent")}>
            <div className="grid gap-3 sm:grid-cols-2">
              {(scents ?? []).map((option) => (
                <OptionButton
                  key={option.id}
                  selected={scentId === option.id}
                  disabled={option.stock <= 0}
                  onClick={() => selectScent(option.id)}
                  title={pick(option, "name")}
                  subtitle={pick(option, "notes")}
                  extra={
                    option.price_delta > 0 ? `+${formatPrice(option.price_delta, locale)}` : undefined
                  }
                  soldOutLabel={t("config.soldOut")}
                  visual={
                    scentImage(option.slug) ? (
                      <img
                        src={scentImage(option.slug)}
                        alt={pick(option, "name")}
                        loading="lazy"
                        className="size-14 shrink-0 rounded-md object-cover"
                      />
                    ) : undefined
                  }
                />
              ))}
            </div>
          </Step>

          <Step index={3} title={t("config.color")}>
            <div className="flex flex-wrap gap-3">
              {(colors ?? []).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  disabled={option.stock <= 0}
                  onClick={() => setColorId(option.id)}
                  className={cn(
                    "w-20 rounded-lg border p-2 text-center transition-all sm:w-24",
                    colorId === option.id ? "border-gold shadow-soft" : "border-border hover:border-gold/60",
                    option.stock <= 0 && "opacity-40",
                  )}
                >
                  <span
                    className="mx-auto block size-12 rounded-full border border-border"
                    style={{ backgroundColor: option.hex }}
                    aria-hidden
                  />
                  <span className="mt-2 block text-xs">{pick(option, "name")}</span>
                  {recommendedColorId === option.id && (
                    <span className="mt-1 block text-[10px] text-gold">{t("config.recommended")}</span>
                  )}
                </button>
              ))}
            </div>
          </Step>

          <Step index={4} title={t("config.dedication")}>
            <Input
              value={message}
              maxLength={150}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={t("config.dedicationPlaceholder")}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {t("config.dedicationHint")}
              {settings ? ` (+${formatPrice(settings.personalization_fee, locale)})` : ""} · {message.length}/150
            </p>
          </Step>

        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
            <p className="eyebrow">{t("config.preview")}</p>
            {packaging && packagingImage(packaging.slug) ? (
              <div className="mt-3">
                <img
                  src={packagingImage(packaging.slug)}
                  alt={pick(packaging, "name")}
                  className="mx-auto aspect-square w-full max-w-56 rounded-lg object-cover"
                />
                <p className="mt-3 text-center font-display text-lg">{scent ? pick(scent, "name") : "—"}</p>
                <p className="text-center text-xs text-muted-foreground">{pick(packaging, "name")}</p>
                {color && (
                  <p className="mt-1 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <span
                      className="inline-block size-3 rounded-full border border-border"
                      style={{ backgroundColor: color.hex }}
                      aria-hidden
                    />
                    {pick(color, "name")}
                  </p>
                )}
              </div>
            ) : (
              <CandlePreview
                hex={color?.hex ?? "#f0e4db"}
                vesselStyle={packaging?.vessel_style ?? "glass"}
                label={scent ? pick(scent, "name") : "—"}
                sublabel={packaging ? pick(packaging, "name") : t("common.select")}
                className="mt-3"
              />
            )}

            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>{t("config.basePrice")}</span>
                <span>{settings ? formatPrice(settings.base_price, locale) : "—"}</span>
              </div>
              {message.trim() && settings && (
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("config.personalizationFee")}</span>
                  <span>+{formatPrice(settings.personalization_fee, locale)}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="qty">{t("config.quantity")}</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                    <Minus className="size-4" />
                  </Button>
                  <span id="qty" className="w-6 text-center">
                    {quantity}
                  </span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity((q) => Math.min(99, q + 1))}>
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base">
                <span>{t("config.total")}</span>
                <strong>{formatPrice(unitPrice * quantity, locale)}</strong>
              </div>
              <p className="text-xs text-muted-foreground">{t("ship.method")}</p>
              <p className={cn("text-xs", freeShipping ? "text-gold" : "text-muted-foreground")}>
                {freeShipping ? t("ship.free") : `${t("ship.addA")} ${missingPcs} ${t("ship.addB")}`}
              </p>
            </div>

            <Button className="mt-6 w-full" size="lg" disabled={!complete} onClick={handleOrderNow}>
              {t("order.now")}
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">{t("order.nowHint")}</p>
            <Button variant="outline" className="mt-3 w-full" disabled={!complete} onClick={handleAdd}>
              {t("config.addToCart")}
            </Button>
            <Button asChild variant="ghost" className="mt-2 w-full">
              <Link to="/cart">{t("nav.cart")}</Link>
            </Button>

          </div>
        </aside>
      </div>
    </div>
  );
}

function Step({ index, title, children }: { index: number; title: string; children: React.ReactNode }) {
  const { t } = useI18n();
  return (
    <section>
      <p className="eyebrow">
        {t("config.step")} {index}
      </p>
      <h2 className="mb-4 mt-1 text-2xl">{title}</h2>
      {children}
    </section>
  );
}

function OptionButton({
  selected,
  disabled,
  onClick,
  title,
  subtitle,
  extra,
  soldOutLabel,
  visual,
}: {
  selected: boolean;
  disabled?: boolean | undefined;
  onClick: () => void;
  title: string;
  subtitle?: string | undefined;
  extra?: string | undefined;
  soldOutLabel: string;
  visual?: React.ReactNode | undefined;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 text-left transition-all",
        selected ? "border-gold bg-secondary/60 shadow-soft" : "border-border hover:border-gold/60",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      {visual}
      <span className="flex-1">
        <span className="flex items-center gap-2">
          <span className="font-display text-lg">{title}</span>
          {selected && <Check className="size-4 text-gold" />}
        </span>
        {subtitle && <span className="mt-1 block text-xs text-muted-foreground">{subtitle}</span>}
        {disabled && <span className="mt-1 block text-xs text-destructive">{soldOutLabel}</span>}
      </span>
      {extra && <span className="text-xs text-muted-foreground">{extra}</span>}
    </button>
  );
}
