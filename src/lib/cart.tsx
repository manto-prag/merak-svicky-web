import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartLine = {
  lineId: string;
  packagingId: string;
  scentId: string;
  colorId: string;
  message: string;
  quantity: number;
  /** display snapshots, recalculated server-side on checkout */
  packagingName: { cs: string; en: string };
  scentName: { cs: string; en: string };
  colorName: { cs: string; en: string };
  colorHex: string;
  unitPrice: number;
};

const STORAGE_KEY = "merak-cart-v1";

type Ctx = {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, "lineId">) => void;
  removeLine: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  hydrated: boolean;
};

const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore corrupted cart */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const value = useMemo<Ctx>(() => {
    const count = lines.reduce((sum, l) => sum + l.quantity, 0);
    const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
    return {
      lines,
      hydrated,
      count,
      subtotal,
      addLine: (line) =>
        setLines((prev) => [
          ...prev,
          { ...line, lineId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` },
        ]),
      removeLine: (lineId) => setLines((prev) => prev.filter((l) => l.lineId !== lineId)),
      setQuantity: (lineId, quantity) =>
        setLines((prev) =>
          prev.map((l) => (l.lineId === lineId ? { ...l, quantity: Math.min(99, Math.max(1, quantity)) } : l)),
        ),
      clear: () => setLines([]),
    };
  }, [lines, hydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
