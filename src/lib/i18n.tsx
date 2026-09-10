import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Locale = "cs" | "en";

const STORAGE_KEY = "merak-locale";

type Dict = Record<string, { cs: string; en: string }>;

export const dict = {
  "nav.home": { cs: "Domů", en: "Home" },
  "nav.create": { cs: "Vytvoř si svíčku", en: "Create Your Candle" },
  "nav.scents": { cs: "Vůně", en: "Scents" },
  "nav.colors": { cs: "Barvy", en: "Colors" },
  "nav.packaging": { cs: "Balení", en: "Packaging" },
  "nav.gifts": { cs: "Dárky", en: "Gifts" },
  "nav.about": { cs: "O nás", en: "About Us" },
  "nav.contact": { cs: "Kontakt", en: "Contact" },
  "nav.cart": { cs: "Košík", en: "Cart" },
  "nav.menu": { cs: "Menu", en: "Menu" },

  "hero.tagline": { cs: "Vůně, barva, okamžik. Tvoje svíčka.", en: "Scent, Color, Moment. Your Candle." },
  "hero.cta": { cs: "VYTVOŘ SI SVÍČKU", en: "CREATE YOUR CANDLE" },
  "hero.sub": {
    cs: "Ručně lité sójové svíčky. 10 vůní, 10 barev, 10 balení – 1 000 kombinací, které jsou jen tvoje.",
    en: "Hand-poured soy candles. 10 scents, 10 colors, 10 packagings – 1,000 combinations that are only yours.",
  },

  "home.how.title": { cs: "Jak to funguje", en: "How it works" },
  "home.how.1.title": { cs: "Vyber balení", en: "Choose packaging" },
  "home.how.1.text": { cs: "Sklo, keramika, beton nebo dárková krabice.", en: "Glass, ceramic, concrete or a gift box." },
  "home.how.2.title": { cs: "Zvol vůni a barvu", en: "Pick scent and color" },
  "home.how.2.text": { cs: "Deset vůní a deset odstínů vosku.", en: "Ten fragrances and ten wax shades." },
  "home.how.3.title": { cs: "Přidej vzkaz", en: "Add a message" },
  "home.how.3.text": { cs: "Osobní věnování na štítek svíčky.", en: "A personal dedication on the candle label." },
  "home.how.4.title": { cs: "Doručíme na Zásilkovnu", en: "Delivered to Zásilkovna" },
  "home.how.4.text": { cs: "Ručně balíme a posíláme do 3 pracovních dnů.", en: "Hand-packed and shipped within 3 working days." },
  "home.scents.title": { cs: "Naše vůně", en: "Our scents" },
  "home.scents.cta": { cs: "Prohlédnout všechny vůně", en: "See all scents" },
  "home.colors.title": { cs: "Odstíny vosku", en: "Wax shades" },
  "home.gifts.title": { cs: "Dárek, který voní", en: "A gift that smells like you" },
  "home.gifts.text": {
    cs: "Sestav svíčku na míru a my ji zabalíme do dárkového balení se stuhou a ručně psaným vzkazem.",
    en: "Build a bespoke candle and we will wrap it with a ribbon and a hand-written note.",
  },
  "home.gifts.cta": { cs: "Dárkové tipy", en: "Gift ideas" },
  "home.story.title": { cs: "Ručně, v malých sériích", en: "Handmade in small batches" },
  "home.story.text": {
    cs: "MERAK znamená potěšení z drobných věcí. Každou svíčku lijeme ručně z přírodního sójového vosku, s bavlněným knotem a parfemací bez ftalátů.",
    en: "MERAK means finding joy in small things. Every candle is hand-poured from natural soy wax, with a cotton wick and phthalate-free fragrance.",
  },

  "config.title": { cs: "Vytvoř si svíčku", en: "Create your candle" },
  "config.step": { cs: "Krok", en: "Step" },
  "config.packaging": { cs: "Balení", en: "Packaging" },
  "config.scent": { cs: "Vůně", en: "Scent" },
  "config.color": { cs: "Barva", en: "Color" },
  "config.message": { cs: "Osobní vzkaz", en: "Personal message" },
  "config.messagePlaceholder": { cs: "Např. Všechno nejlepší, Terezo!", en: "e.g. Happy birthday, Tereza!" },
  "config.messageHint": { cs: "Nepovinné, max. 80 znaků", en: "Optional, max. 80 characters" },
  "config.quantity": { cs: "Množství", en: "Quantity" },
  "config.preview": { cs: "Náhled", en: "Preview" },
  "config.total": { cs: "Celkem", en: "Total" },
  "config.addToCart": { cs: "Přidat do košíku", en: "Add to cart" },
  "config.added": { cs: "Svíčka přidána do košíku", en: "Candle added to your cart" },
  "config.soldOut": { cs: "Dočasně vyprodáno", en: "Temporarily sold out" },
  "config.personalizationFee": { cs: "Personalizace", en: "Personalization" },
  "config.basePrice": { cs: "Základ", en: "Base" },
  "config.selectAll": { cs: "Vyber balení, vůni a barvu", en: "Choose packaging, scent and color" },

  "cart.title": { cs: "Košík", en: "Cart" },
  "cart.empty": { cs: "Košík je zatím prázdný.", en: "Your cart is still empty." },
  "cart.continue": { cs: "Pokračovat k pokladně", en: "Continue to checkout" },
  "cart.remove": { cs: "Odebrat", en: "Remove" },
  "cart.subtotal": { cs: "Mezisoučet", en: "Subtotal" },
  "cart.shipping": { cs: "Doprava (Zásilkovna)", en: "Shipping (Zásilkovna)" },
  "cart.total": { cs: "Celkem k úhradě", en: "Total" },
  "cart.freeShipping": { cs: "Doprava zdarma", en: "Free shipping" },
  "cart.keepShopping": { cs: "Zpět do konfigurátoru", en: "Back to the configurator" },
  "cart.message": { cs: "Vzkaz", en: "Message" },
  "cart.pcs": { cs: "ks", en: "pcs" },
  "cart.pieces": { cs: "Počet svíček celkem", en: "Total candles" },

  "ship.rule": {
    cs: "Doprava Zásilkovnou zdarma od 30 ks.",
    en: "Free Zásilkovna shipping from 30 pcs.",
  },
  "ship.free": { cs: "🎁 Máte dopravu ZDARMA!", en: "🎁 You have FREE shipping!" },
  "ship.addA": { cs: "Přidejte ještě", en: "Add" },
  "ship.addB": { cs: "ks a získáte dopravu zdarma!", en: "more pcs to get free shipping!" },
  "ship.method": { cs: "Doprava: Zásilkovna", en: "Shipping: Zásilkovna" },

  "order.now": { cs: "OBJEDNAT IHNED", en: "ORDER NOW" },
  "order.nowHint": {
    cs: "Otevře se váš e-mailový program s předvyplněnou objednávkou na svicky.merak@email.cz.",
    en: "Opens your e-mail app with a pre-filled order to svicky.merak@email.cz.",
  },

  "config.dedication": { cs: "Přidejte osobní věnování", en: "Add a personal dedication" },
  "config.dedicationPlaceholder": {
    cs: "Například: Pro nejlepší maminku s láskou ❤️",
    en: "For example: For the best mum with love ❤️",
  },
  "config.dedicationHint": { cs: "Nepovinné, max. 150 znaků", en: "Optional, max. 150 characters" },
  "config.recommended": { cs: "Doporučená barva k vůni", en: "Recommended color for this scent" },

  "checkout.title": { cs: "Pokladna", en: "Checkout" },
  "checkout.name": { cs: "Jméno a příjmení", en: "Full name" },
  "checkout.email": { cs: "E-mail", en: "E-mail" },
  "checkout.phone": { cs: "Telefon", en: "Phone" },
  "checkout.pickup": { cs: "Výdejní místo Zásilkovny", en: "Zásilkovna pickup point" },
  "checkout.pickupPlaceholder": { cs: "Vyber výdejní místo", en: "Select a pickup point" },
  "checkout.pickupOther": { cs: "Jiné výdejní místo (napiš adresu)", en: "Other pickup point (type the address)" },
  "checkout.note": { cs: "Poznámka k objednávce", en: "Order note" },
  "checkout.consent": {
    cs: "Souhlasím s obchodními podmínkami a zpracováním osobních údajů.",
    en: "I agree to the terms & conditions and the privacy policy.",
  },
  "checkout.submit": { cs: "Odeslat objednávku", en: "Place order" },
  "checkout.payment": { cs: "Platba", en: "Payment" },
  "checkout.paymentInfo": {
    cs: "Platba QR kódem nebo bankovním převodem. Platební údaje dostaneš hned po odeslání objednávky a také e-mailem.",
    en: "Payment by QR code or bank transfer. You will get the payment details right after ordering and by e-mail.",
  },
  "checkout.summary": { cs: "Souhrn objednávky", en: "Order summary" },
  "checkout.sending": { cs: "Odesílám…", en: "Sending…" },

  "order.thanks": { cs: "Děkujeme za objednávku!", en: "Thank you for your order!" },
  "order.number": { cs: "Číslo objednávky", en: "Order number" },
  "order.payTitle": { cs: "Zaplať QR kódem", en: "Pay with a QR code" },
  "order.payHint": {
    cs: "Naskenuj QR kód v bankovní aplikaci, nebo použij údaje níže. Jako variabilní symbol uveď číslo objednávky.",
    en: "Scan the QR code in your banking app, or use the details below. Use the order number as the variable symbol.",
  },
  "order.account": { cs: "Číslo účtu", en: "Account number" },
  "order.iban": { cs: "IBAN", en: "IBAN" },
  "order.amount": { cs: "Částka", en: "Amount" },
  "order.vs": { cs: "Variabilní symbol", en: "Variable symbol" },
  "order.emailSent": {
    cs: "Potvrzení jsme ti poslali na e-mail. Po přijetí platby balíček odešleme a pošleme sledovací číslo.",
    en: "We have sent you a confirmation e-mail. Once the payment arrives we ship the parcel and send you the tracking number.",
  },
  "order.items": { cs: "Objednané svíčky", en: "Ordered candles" },
  "order.notFound": { cs: "Objednávka nenalezena.", en: "Order not found." },

  "scents.title": { cs: "Vůně", en: "Scents" },
  "scents.intro": {
    cs: "Deset vůní, které si můžeš nechat nalít do jakékoli barvy a balení.",
    en: "Ten fragrances you can have poured into any color and packaging.",
  },
  "colors.title": { cs: "Barvy", en: "Colors" },
  "colors.intro": {
    cs: "Barvíme přírodním pigmentem, odstíny jsou jemné a matné.",
    en: "We tint with natural pigment, so the shades stay soft and matte.",
  },
  "packaging.title": { cs: "Balení", en: "Packaging" },
  "packaging.intro": {
    cs: "Od klasického skla po ručně glazovanou keramiku a dárkové krabice.",
    en: "From classic glass to hand-glazed ceramics and gift boxes.",
  },
  "gifts.title": { cs: "Dárky", en: "Gifts" },
  "gifts.intro": {
    cs: "Nevíš, co vybrat? Tyhle kombinace jsou u nás nejoblíbenější.",
    en: "Not sure what to pick? These combinations are our bestsellers.",
  },
  "gifts.use": { cs: "Vytvořit tuto svíčku", en: "Create this candle" },
  "about.title": { cs: "O nás", en: "About Us" },
  "contact.title": { cs: "Kontakt", en: "Contact" },
  "contact.intro": {
    cs: "Napiš nám cokoli – ráda poradím s výběrem vůně i s dárkem na míru.",
    en: "Write to us about anything – we are happy to help with scents and bespoke gifts.",
  },
  "contact.message": { cs: "Zpráva", en: "Message" },
  "contact.send": { cs: "Odeslat zprávu", en: "Send message" },
  "contact.sent": { cs: "Děkujeme, ozveme se co nejdřív.", en: "Thank you, we will get back to you soon." },

  "common.from": { cs: "od", en: "from" },
  "common.select": { cs: "Vybrat", en: "Select" },
  "common.selected": { cs: "Vybráno", en: "Selected" },
  "common.create": { cs: "Vytvořit svíčku", en: "Create a candle" },
  "common.loading": { cs: "Načítám…", en: "Loading…" },
  "common.back": { cs: "Zpět", en: "Back" },
  "common.next": { cs: "Další", en: "Next" },
  "common.required": { cs: "Vyplň prosím toto pole.", en: "Please fill in this field." },
  "common.error": { cs: "Něco se pokazilo. Zkus to prosím znovu.", en: "Something went wrong. Please try again." },

  "footer.shop": { cs: "Nakupování", en: "Shopping" },
  "footer.legal": { cs: "Informace", en: "Information" },
  "footer.contact": { cs: "Kontakt", en: "Contact" },
  "footer.rights": { cs: "Všechna práva vyhrazena.", en: "All rights reserved." },
  "footer.handmade": { cs: "Ručně vyrobeno v České republice", en: "Handmade in the Czech Republic" },
  "footer.company": { cs: "Fakturační údaje", en: "Company details" },
  "footer.qr.web": { cs: "Navštivte náš web", en: "Visit our website" },
  "footer.qr.pay": { cs: "Zaplatit QR kódem", en: "Pay by QR code" },

  "legal.terms": { cs: "Obchodní podmínky", en: "Terms & Conditions" },
  "legal.privacy": { cs: "Ochrana osobních údajů", en: "Privacy Policy" },
  "legal.returns": { cs: "Vrácení a reklamace", en: "Returns & Complaints" },
  "legal.cookies": { cs: "Cookies", en: "Cookies" },

  "cookies.text": {
    cs: "Používáme jen nezbytné cookies, aby košík fungoval. Nic o tobě nesledujeme.",
    en: "We only use essential cookies so the cart works. We do not track you.",
  },
  "cookies.accept": { cs: "Rozumím", en: "Got it" },
  "cookies.more": { cs: "Více", en: "More" },
} satisfies Dict;

export type TKey = keyof typeof dict;

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TKey) => string;
  pick: <T extends Record<string, unknown>>(row: T, field: string) => string;
};

const LocaleContext = createContext<Ctx | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("cs");

  useEffect(() => {
    const url = new URL(window.location.href);
    const param = url.searchParams.get("lang");
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const next = param === "en" || param === "cs" ? param : stored === "en" ? "en" : "cs";
    setLocaleState(next);
    document.documentElement.lang = next;
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      locale,
      setLocale,
      t: (key) => dict[key][locale],
      pick: (row, field) => String((row as Record<string, unknown>)[`${field}_${locale}`] ?? ""),
    }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useI18n must be used inside LocaleProvider");
  return ctx;
}

export function formatPrice(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "cs" ? "cs-CZ" : "en-GB", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
}
