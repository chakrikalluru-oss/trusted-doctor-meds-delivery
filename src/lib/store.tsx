import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { computeBill, type CartLine, type Order } from "./orders";

export type TextScale = "normal" | "large" | "xlarge";
export type Prescription = { fileName: string; addedAt: number };

type Profile = { name: string; phone: string; address: string };

type Store = {
  hydrated: boolean;
  cart: CartLine[];
  cartCount: number;
  qtyOf: (id: string) => number;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  prescription: Prescription | null;
  setPrescription: (p: Prescription | null) => void;
  orders: Order[];
  placeOrder: (payment: Order["payment"]) => string;
  reorder: (orderId: string) => void;
  textScale: TextScale;
  setTextScale: (s: TextScale) => void;
  profile: Profile;
};

const KEY = "meditrust-v1";
const SCALE: Record<TextScale, string> = { normal: "112.5%", large: "125%", xlarge: "140%" };

const profile: Profile = {
  name: "Kamala Devi",
  phone: "+91 98300 12345",
  address: "12B, Rose Apartments, Civil Lines",
};

const StoreContext = createContext<Store | null>(null);

function seedOrders(): Order[] {
  return [
    {
      id: "MT482193",
      createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
      lines: [
        { medicineId: "metformin-500", qty: 2 },
        { medicineId: "amlodipine-5", qty: 1 },
        { medicineId: "vitamin-d3", qty: 1 },
      ],
      total: 230,
      payment: "upi",
      address: profile.address,
      deliveryOtp: "4821",
      delivered: true,
    },
  ];
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [textScale, setTextScale] = useState<TextScale>("normal");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setCart(saved.cart ?? []);
        setPrescription(saved.prescription ?? null);
        setOrders(saved.orders?.length ? saved.orders : seedOrders());
        setTextScale(saved.textScale ?? "normal");
      } else {
        setOrders(seedOrders());
      }
    } catch {
      setOrders(seedOrders());
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify({ cart, prescription, orders, textScale }));
  }, [hydrated, cart, prescription, orders, textScale]);

  useEffect(() => {
    document.documentElement.style.fontSize = SCALE[textScale];
  }, [textScale]);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((prev) => {
      const rest = prev.filter((l) => l.medicineId !== id);
      if (qty <= 0) return rest;
      const exists = prev.some((l) => l.medicineId === id);
      return exists
        ? prev.map((l) => (l.medicineId === id ? { ...l, qty } : l))
        : [...rest, { medicineId: id, qty }];
    });
  }, []);

  const placeOrder = useCallback(
    (payment: Order["payment"]) => {
      const id = `MT${String(Date.now()).slice(-6)}`;
      const order: Order = {
        id,
        createdAt: Date.now(),
        lines: cart,
        total: computeBill(cart).total,
        payment,
        address: profile.address,
        deliveryOtp: String(1000 + Math.floor(Math.random() * 9000)),
      };
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      return id;
    },
    [cart],
  );

  const reorder = useCallback(
    (orderId: string) => {
      const order = orders.find((o) => o.id === orderId);
      if (order) setCart(order.lines.map((l) => ({ ...l })));
    },
    [orders],
  );

  const value = useMemo<Store>(
    () => ({
      hydrated,
      cart,
      cartCount: cart.reduce((n, l) => n + l.qty, 0),
      qtyOf: (id) => cart.find((l) => l.medicineId === id)?.qty ?? 0,
      setQty,
      clearCart: () => setCart([]),
      prescription,
      setPrescription,
      orders,
      placeOrder,
      reorder,
      textScale,
      setTextScale,
      profile,
    }),
    [hydrated, cart, prescription, orders, placeOrder, reorder, setQty, textScale],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
