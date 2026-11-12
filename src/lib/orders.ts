import { getMedicine } from "./data";

export type CartLine = { medicineId: string; qty: number };

export type Order = {
  id: string;
  createdAt: number;
  lines: CartLine[];
  total: number;
  payment: "upi" | "cod";
  address: string;
  deliveryOtp: string;
  delivered?: boolean;
};

// Placeholder delivery rule — confirm the real fee and threshold with the business.
export const FREE_DELIVERY_FROM = 499;
export const DELIVERY_FEE = 40;

export function computeBill(lines: CartLine[]) {
  let subtotal = 0;
  let mrpTotal = 0;
  for (const line of lines) {
    const m = getMedicine(line.medicineId);
    if (!m) continue;
    subtotal += m.price * line.qty;
    mrpTotal += m.mrp * line.qty;
  }
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  return { subtotal, savings: mrpTotal - subtotal, delivery, total: subtotal + delivery };
}

export function needsPrescription(lines: CartLine[]) {
  return lines.some((l) => getMedicine(l.medicineId)?.rx);
}

export const ORDER_STEPS = [
  { title: "Order placed", detail: "We have received your order." },
  { title: "Checked by pharmacist", detail: "A licensed pharmacist checked your prescription." },
  { title: "Packed at hospital pharmacy", detail: "Sealed with the hospital's tamper-proof sticker." },
  { title: "On the way", detail: "Your delivery partner is coming to you." },
  { title: "Delivered", detail: "Handed over safely." },
] as const;

// Demo progression: one step every 20 seconds so the tracking screen can be tried end to end.
export function orderStep(order: Order, now: number) {
  if (order.delivered) return ORDER_STEPS.length - 1;
  const step = Math.floor((now - order.createdAt) / 20000);
  return Math.min(Math.max(step, 0), ORDER_STEPS.length - 1);
}
