import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const lineSchema = z.object({
  packagingId: z.string().uuid(),
  scentId: z.string().uuid(),
  colorId: z.string().uuid(),
  message: z.string().trim().max(80).default(""),
  quantity: z.number().int().min(1).max(20),
});

const createOrderSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(40),
  pickupPoint: z.string().trim().min(3).max(200),
  note: z.string().trim().max(500).default(""),
  locale: z.enum(["cs", "en"]).default("cs"),
  lines: z.array(lineSchema).min(1).max(20),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createOrderSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { paymentDetails, orderConfirmationEmail, sendEmail } = await import("./orders.server");

    const [settingsRes, scentsRes, colorsRes, packRes] = await Promise.all([
      supabaseAdmin.from("shop_settings").select("*").eq("id", 1).single(),
      supabaseAdmin.from("scents").select("*").eq("active", true),
      supabaseAdmin.from("colors").select("*").eq("active", true),
      supabaseAdmin.from("packagings").select("*").eq("active", true),
    ]);
    if (settingsRes.error) throw settingsRes.error;
    const settings = settingsRes.data;
    const scents = scentsRes.data ?? [];
    const colors = colorsRes.data ?? [];
    const packagings = packRes.data ?? [];

    const items = data.lines.map((line) => {
      const scent = scents.find((s) => s.id === line.scentId);
      const color = colors.find((c) => c.id === line.colorId);
      const packaging = packagings.find((p) => p.id === line.packagingId);
      if (!scent || !color || !packaging) throw new Error("Selected option is no longer available");
      const unitPrice =
        settings.base_price +
        scent.price_delta +
        color.price_delta +
        packaging.price_delta +
        (line.message ? settings.personalization_fee : 0);
      return {
        line,
        scent,
        color,
        packaging,
        unitPrice,
        lineTotal: unitPrice * line.quantity,
      };
    });

    const itemsTotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
    const shippingTotal = itemsTotal >= settings.free_shipping_from ? 0 : settings.shipping_price;
    const total = itemsTotal + shippingTotal;

    const today = new Date();
    const stamp = `${String(today.getFullYear()).slice(2)}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

    let order: { id: string; order_number: string } | null = null;
    let orderNumber = "";
    for (let attempt = 0; attempt < 6 && !order; attempt++) {
      orderNumber = `${stamp}${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
      const { data: inserted, error: orderError } = await supabaseAdmin
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_name: data.customerName,
          email: data.email,
          phone: data.phone,
          pickup_point: data.pickupPoint,
          note: data.note,
          locale: data.locale,
          items_total: itemsTotal,
          shipping_total: shippingTotal,
          total,
        })
        .select("id, order_number")
        .single();
      if (inserted) order = inserted;
      else if (orderError && !orderError.message.includes("duplicate")) throw orderError;
    }
    if (!order) throw new Error("Could not create order, please try again");

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(
      items.map((i) => ({
        order_id: order.id,
        scent_id: i.scent.id,
        color_id: i.color.id,
        packaging_id: i.packaging.id,
        scent_name_cs: i.scent.name_cs,
        scent_name_en: i.scent.name_en,
        color_name_cs: i.color.name_cs,
        color_name_en: i.color.name_en,
        color_hex: i.color.hex,
        packaging_name_cs: i.packaging.name_cs,
        packaging_name_en: i.packaging.name_en,
        message: i.line.message,
        quantity: i.line.quantity,
        unit_price: i.unitPrice,
        line_total: i.lineTotal,
      })),
    );
    if (itemsError) throw itemsError;

    const payment = paymentDetails({
      iban: settings.bank_iban,
      account: settings.bank_account,
      holder: settings.bank_holder,
      orderNumber,
      amount: total,
    });

    const payload = {
      orderNumber,
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      pickupPoint: data.pickupPoint,
      note: data.note,
      locale: data.locale,
      itemsTotal,
      shippingTotal,
      total,
      items: items.map((i) => ({
        scent: data.locale === "cs" ? i.scent.name_cs : i.scent.name_en,
        color: data.locale === "cs" ? i.color.name_cs : i.color.name_en,
        packaging: data.locale === "cs" ? i.packaging.name_cs : i.packaging.name_en,
        message: i.line.message,
        quantity: i.line.quantity,
        lineTotal: i.lineTotal,
      })),
      payment,
    };

    const mail = orderConfirmationEmail(payload);
    await sendEmail({ to: data.email, subject: mail.subject, html: mail.html });

    return payload;
  });

export const getOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ orderNumber: z.string().trim().max(20), email: z.string().trim().email() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { paymentDetails } = await import("./orders.server");

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("order_number", data.orderNumber)
      .ilike("email", data.email)
      .maybeSingle();
    if (!order) return null;

    const { data: settings } = await supabaseAdmin
      .from("shop_settings")
      .select("bank_account, bank_iban, bank_holder")
      .eq("id", 1)
      .single();

    return {
      orderNumber: order.order_number,
      customerName: order.customer_name,
      email: order.email,
      pickupPoint: order.pickup_point,
      locale: order.locale as "cs" | "en",
      status: order.status,
      itemsTotal: order.items_total,
      shippingTotal: order.shipping_total,
      total: order.total,
      trackingNumber: order.tracking_number,
      items: order.order_items.map((i) => ({
        scent: order.locale === "cs" ? i.scent_name_cs : i.scent_name_en,
        color: order.locale === "cs" ? i.color_name_cs : i.color_name_en,
        packaging: order.locale === "cs" ? i.packaging_name_cs : i.packaging_name_en,
        colorHex: i.color_hex,
        message: i.message,
        quantity: i.quantity,
        lineTotal: i.line_total,
      })),
      payment: paymentDetails({
        iban: settings?.bank_iban ?? "",
        account: settings?.bank_account ?? "",
        holder: settings?.bank_holder ?? "MERAK",
        orderNumber: order.order_number,
        amount: order.total,
      }),
    };
  });

export const listOrders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { data, error } = await context.supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        orderId: z.string().uuid(),
        status: z.enum(["new", "paid", "shipped", "cancelled"]),
        trackingNumber: z.string().trim().max(60).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const now = new Date().toISOString();
    const patch = {
      status: data.status,
      ...(data.status === "paid" ? { paid_at: now } : {}),
      ...(data.status === "shipped"
        ? { shipped_at: now, tracking_number: data.trackingNumber ?? null }
        : {}),
    };

    const { data: order, error } = await context.supabase
      .from("orders")
      .update(patch)
      .eq("id", data.orderId)
      .select("order_number, email, locale, customer_name, tracking_number")
      .single();
    if (error) throw error;

    if (data.status === "shipped" && order.tracking_number) {
      const { shippingEmail, sendEmail } = await import("./orders.server");
      const mail = shippingEmail({
        orderNumber: order.order_number,
        locale: order.locale,
        trackingNumber: order.tracking_number,
        customerName: order.customer_name,
      });
      await sendEmail({ to: order.email, subject: mail.subject, html: mail.html });
    }

    return { ok: true };
  });
