export const ORDER_EMAIL = "svicky.merak@email.cz";

/** Doprava Zásilkovnou zdarma od tohoto počtu kusů svíček. */
export const FREE_SHIPPING_FROM_PCS = 30;

export type MailItem = {
  product: string;
  packaging: string;
  scent: string;
  color: string;
  quantity: number;
  message: string;
};

export type MailOrder = {
  items: MailItem[];
  pickupPoint?: string;
  customerName?: string;
  email?: string;
  phone?: string;
  note?: string;
};

export function totalPieces(items: { quantity: number }[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function isFreeShipping(pieces: number) {
  return pieces >= FREE_SHIPPING_FROM_PCS;
}

function itemBlock(item: MailItem) {
  return [
    `Produkt: ${item.product}`,
    `Balení: ${item.packaging}`,
    `Vůně: ${item.scent}`,
    `Barva: ${item.color}`,
    `Počet kusů: ${item.quantity} ks`,
    `Věnování:`,
    item.message.trim() ? item.message.trim() : "Bez věnování",
  ].join("\n");
}

export function buildOrderMailto(order: MailOrder) {
  const pieces = totalPieces(order.items);
  const free = isFreeShipping(pieces);

  const subject =
    order.items.length === 1 && order.items[0]
      ? `Objednávka svíček – ${order.items[0].product}`
      : "Objednávka – vlastní svíčka";

  const body = [
    "Dobrý den,",
    "",
    "mám zájem o objednávku:",
    "",
    order.items.map(itemBlock).join("\n\n"),
    "",
    `Celkový počet kusů: ${pieces} ks`,
    "Doprava: Zásilkovna",
    `Výdejní místo: ${order.pickupPoint?.trim() || "upřesním po potvrzení"}`,
    `Doprava: ${free ? "ZDARMA" : "dle ceníku"}`,
    ...(order.customerName?.trim() ? ["", `Jméno: ${order.customerName.trim()}`] : []),
    ...(order.email?.trim() ? [`E-mail: ${order.email.trim()}`] : []),
    ...(order.phone?.trim() ? [`Telefon: ${order.phone.trim()}`] : []),
    ...(order.note?.trim() ? [`Poznámka: ${order.note.trim()}`] : []),
    "",
    "Prosím o potvrzení objednávky a informace k dokončení objednávky.",
    "",
    "Děkuji.",
  ].join("\n");

  return `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function openOrderMail(order: MailOrder) {
  window.location.href = buildOrderMailto(order);
}
