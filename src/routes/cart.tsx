import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Banknote, CheckCircle2, FileWarning, MapPin, ShoppingBag, Smartphone, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { Card, QtyStepper, RxBadge, SectionTitle } from "@/components/app/bits";
import { Button } from "@/components/ui/button";
import { getHospital, getMedicine, rupees } from "@/lib/data";
import { computeBill, FREE_DELIVERY_FROM, needsPrescription, type Order } from "@/lib/orders";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — MediTrust" },
      { name: "description", content: "Review your medicines and place your order." },
      { property: "og:title", content: "Your cart — MediTrust" },
      { property: "og:description", content: "Review your medicines and place your order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, setQty, prescription, placeOrder, profile, hydrated } = useStore();
  const [payment, setPayment] = useState<Order["payment"]>("upi");
  const navigate = useNavigate();
  const bill = computeBill(cart);
  const rxNeeded = needsPrescription(cart);
  const blocked = rxNeeded && !prescription;

  if (hydrated && cart.length === 0) {
    return (
      <AppShell title="Cart">
        <div className="mt-10 flex flex-col items-center text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted">
            <ShoppingBag className="size-10 text-muted-foreground" />
          </span>
          <h2 className="mt-4 text-2xl font-bold">Your cart is empty</h2>
          <p className="mt-1 text-lg text-muted-foreground">Add medicines from your hospital.</p>
          <Button asChild variant="hero" size="xl" className="mt-6">
            <Link to="/">Browse hospitals</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const submit = () => {
    const id = placeOrder(payment);
    toast.success("Order placed");
    navigate({ to: "/orders/$orderId", params: { orderId: id } });
  };

  return (
    <AppShell
      title="Cart"
      actionBar={
        <div>
          {blocked && (
            <p className="mb-2 text-center text-base font-semibold text-rx">Add your prescription to continue</p>
          )}
          <Button variant="hero" size="xl" className="w-full" disabled={blocked || !hydrated} onClick={submit}>
            Place order · {rupees(bill.total)}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        {cart.map((line) => {
          const m = getMedicine(line.medicineId);
          if (!m) return null;
          return (
            <Card key={m.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-lg font-bold leading-snug">{m.name} {m.strength}</p>
                  <p className="text-base text-muted-foreground">{getHospital(m.hospitalId)?.name}</p>
                  {m.rx && <RxBadge className="mt-1.5" />}
                </div>
                <button onClick={() => setQty(m.id, 0)} aria-label={`Remove ${m.name}`} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted">
                  <Trash2 className="size-5" />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <QtyStepper qty={line.qty} onChange={(n) => setQty(m.id, n)} label={m.name} />
                <span className="text-xl font-bold">{rupees(m.price * line.qty)}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {rxNeeded && (
        <Link
          to="/prescription"
          className={cn(
            "mt-4 flex items-center gap-3 rounded-2xl border-2 p-4",
            prescription ? "border-success/40 bg-success-soft" : "border-rx/40 bg-rx-soft",
          )}
        >
          {prescription ? <CheckCircle2 className="size-7 shrink-0 text-success" /> : <FileWarning className="size-7 shrink-0 text-rx" />}
          <span className="flex-1">
            <span className="block text-lg font-bold">{prescription ? "Prescription added" : "Prescription needed"}</span>
            <span className="block text-base text-muted-foreground">
              {prescription ? prescription.fileName : "Some medicines need your doctor's prescription. Tap to add."}
            </span>
          </span>
        </Link>
      )}

      <SectionTitle>Deliver to</SectionTitle>
      <Card className="flex items-start gap-3">
        <MapPin className="mt-0.5 size-6 shrink-0 text-primary" />
        <div>
          <p className="text-lg font-semibold">{profile.name}</p>
          <p className="text-base text-muted-foreground">{profile.address}</p>
        </div>
      </Card>

      <SectionTitle>How will you pay?</SectionTitle>
      <div role="radiogroup" className="grid grid-cols-2 gap-3">
        {[
          { id: "upi" as const, label: "UPI / Card", icon: Smartphone },
          { id: "cod" as const, label: "Cash at door", icon: Banknote },
        ].map((p) => (
          <button
            key={p.id}
            role="radio"
            aria-checked={payment === p.id}
            onClick={() => setPayment(p.id)}
            className={cn(
              "flex flex-col items-start gap-2 rounded-2xl border-2 p-4 text-left text-lg font-semibold transition-colors",
              payment === p.id ? "border-primary bg-primary-soft text-accent-foreground" : "bg-card",
            )}
          >
            <p.icon className="size-7" />
            {p.label}
          </button>
        ))}
      </div>

      <SectionTitle>Bill</SectionTitle>
      <Card className="space-y-2 text-lg">
        <Row label="Medicines" value={rupees(bill.subtotal)} />
        <Row label="Delivery" value={bill.delivery === 0 ? "Free" : rupees(bill.delivery)} />
        {bill.delivery > 0 && (
          <p className="text-base text-muted-foreground">Free delivery on orders above {rupees(FREE_DELIVERY_FROM)}</p>
        )}
        <div className="border-t pt-2">
          <Row label="To pay" value={rupees(bill.total)} strong />
        </div>
        {bill.savings > 0 && <p className="text-base font-semibold text-success">You save {rupees(bill.savings)} on this order</p>}
      </Card>
    </AppShell>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cn("flex justify-between", strong && "text-xl font-bold")}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
