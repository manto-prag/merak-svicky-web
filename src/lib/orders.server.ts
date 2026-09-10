import { buildSpayd } from "./spayd";

export type IncomingLine = {
  packagingId: string;
  scentId: string;
  colorId: string;
  message: string;
  quantity: number;
};

export type OrderPayload = {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  pickupPoint: string;
  note: string;
  locale: "cs" | "en";
  itemsTotal: number;
  shippingTotal: number;
  total: number;
  items: {
    scent: string;
    color: string;
    packaging: string;
    message: string;
    quantity: number;
    lineTotal: number;
  }[];
  payment: {
    account: string;
    iban: string;
    holder: string;
    variableSymbol: string;
    amount: number;
    spayd: string;
  };
};

export function paymentDetails(input: {
  iban: string;
  account: string;
  holder: string;
  orderNumber: string;
  amount: number;
}) {
  return {
    account: input.account,
    iban: input.iban,
    holder: input.holder,
    variableSymbol: input.orderNumber.replace(/\D/g, ""),
    amount: input.amount,
    spayd: buildSpayd({
      iban: input.iban,
      amount: input.amount,
      variableSymbol: input.orderNumber,
      message: `MERAK ${input.orderNumber}`,
      recipient: input.holder,
    }),
  };
}

const money = (value: number, locale: string) =>
  new Intl.NumberFormat(locale === "cs" ? "cs-CZ" : "en-GB", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);

export function orderConfirmationEmail(order: OrderPayload) {
  const cs = order.locale === "cs";
  const rows = order.items
    .map(
      (item) => `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #eadfd2">
          <strong>${escapeHtml(item.packaging)}</strong><br/>
          ${cs ? "Vůně" : "Scent"}: ${escapeHtml(item.scent)}<br/>
          ${cs ? "Barva" : "Color"}: ${escapeHtml(item.color)}
          ${item.message ? `<br/>${cs ? "Vzkaz" : "Message"}: „${escapeHtml(item.message)}“` : ""}
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #eadfd2;text-align:right;white-space:nowrap">
          ${item.quantity} × &nbsp; ${money(item.lineTotal, order.locale)}
        </td>
      </tr>`,
    )
    .join("");

  const subject = cs
    ? `MERAK svíčky – potvrzení objednávky ${order.orderNumber}`
    : `MERAK svíčky – order confirmation ${order.orderNumber}`;

  const html = `<div style="font-family:Georgia,serif;background:#faf6f0;padding:28px;color:#4a3a2f">
    <h1 style="font-weight:400;letter-spacing:.08em">MERAK svíčky</h1>
    <p>${cs ? "Děkujeme za tvoji objednávku!" : "Thank you for your order!"}</p>
    <p><strong>${cs ? "Číslo objednávky" : "Order number"}: ${order.orderNumber}</strong></p>
    <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows}</table>
    <p style="font-family:Arial,sans-serif;font-size:14px">
      ${cs ? "Doprava" : "Shipping"}: ${money(order.shippingTotal, order.locale)}<br/>
      <strong>${cs ? "Celkem" : "Total"}: ${money(order.total, order.locale)}</strong>
    </p>
    <h2 style="font-weight:400">${cs ? "Platební údaje" : "Payment details"}</h2>
    <p style="font-family:Arial,sans-serif;font-size:14px">
      ${cs ? "Účet" : "Account"}: ${order.payment.account}<br/>
      IBAN: ${order.payment.iban}<br/>
      ${cs ? "Částka" : "Amount"}: ${money(order.payment.amount, order.locale)}<br/>
      ${cs ? "Variabilní symbol" : "Variable symbol"}: ${order.payment.variableSymbol}<br/>
      ${cs ? "Příjemce" : "Recipient"}: ${escapeHtml(order.payment.holder)}
    </p>
    <p style="font-family:Arial,sans-serif;font-size:14px">
      ${cs ? "QR platbu najdeš na stránce objednávky." : "The payment QR code is on your order page."}
    </p>
    <p style="font-family:Arial,sans-serif;font-size:14px">
      ${cs ? "Výdejní místo" : "Pickup point"}: ${escapeHtml(order.pickupPoint)}
    </p>
  </div>`;

  return { subject, html };
}

export function shippingEmail(input: {
  orderNumber: string;
  locale: string;
  trackingNumber: string;
  customerName: string;
}) {
  const cs = input.locale === "cs";
  const subject = cs
    ? `MERAK svíčky – objednávka ${input.orderNumber} je na cestě`
    : `MERAK svíčky – order ${input.orderNumber} has been shipped`;
  const html = `<div style="font-family:Georgia,serif;background:#faf6f0;padding:28px;color:#4a3a2f">
    <h1 style="font-weight:400;letter-spacing:.08em">MERAK svíčky</h1>
    <p>${cs ? `Ahoj ${escapeHtml(input.customerName)}, balíček je na cestě.` : `Hi ${escapeHtml(input.customerName)}, your parcel is on its way.`}</p>
    <p style="font-family:Arial,sans-serif;font-size:14px">
      ${cs ? "Číslo objednávky" : "Order number"}: ${input.orderNumber}<br/>
      ${cs ? "Sledovací číslo Zásilkovny" : "Zásilkovna tracking number"}: <strong>${escapeHtml(input.trackingNumber)}</strong>
    </p>
    <p style="font-family:Arial,sans-serif;font-size:14px">
      <a href="https://tracking.packeta.com/cs/?id=${encodeURIComponent(input.trackingNumber)}">
        ${cs ? "Sledovat zásilku" : "Track the parcel"}
      </a>
    </p>
  </div>`;
  return { subject, html };
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Transactional e-mail hook. A verified sender domain is required before
 * messages can actually leave the shop, so for now this logs the message and
 * never blocks the order flow.
 */
export async function sendEmail(input: { to: string; subject: string; html: string }) {
  console.info("[email] pending sender domain setup:", input.subject, "->", input.to);
  return { sent: false };
}
