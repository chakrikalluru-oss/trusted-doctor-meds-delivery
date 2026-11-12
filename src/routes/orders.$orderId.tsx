import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, KeyRound, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app/app-shell";
import { Card, SectionTitle } from "@/components/app/bits";
import { getMedicine, rupees } from "@/lib/data";
import { ORDER_STEPS, orderStep } from "@/lib/orders";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders/$orderId")({
  head: ({ params }) => ({
    meta: [
      { title: `Order ${params.orderId} — MediTrust` },
      { name: "description", content: "Follow your medicine delivery step by step." },
      { property: "og:title", content: `Order ${params.orderId} — MediTrust` },
      { property: "og:description", content: "Follow your medicine delivery step by step." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TrackOrder,
});

function TrackOrder() {
  const { orderId } = Route.useParams();
  const { orders, hydrated } = useStore();
  const [now, setNow] = useState(0);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 2000);
    return () => clearInterval(t);
  }, []);

  const order = orders.find((o) => o.id === orderId);
  if (!hydrated || !now) return <AppShell title="Order" showBack>{null}</AppShell>;
  if (!order) {
    return (
      <AppShell title="Order" showBack>
        <p className="text-lg">We could not find this order.</p>
        <Link to="/orders" className="mt-4 inline-block text-lg font-semibold text-primary underline">See all orders</Link>
      </AppShell>
    );
  }

  const step = orderStep(order, now);
  const delivered = step === ORDER_STEPS.length - 1;

  return (
    <AppShell title={`Order ${order.id}`} showBack>
      <div className={cn("rounded-3xl p-5", delivered ? "bg-success-soft" : "bg-primary text-primary-foreground shadow-lift")}>
        <p className="text-base opacity-90">{delivered ? "All done" : "Right now"}</p>
        <h2 className="text-2xl font-bold">{ORDER_STEPS[step]!.title}</h2>
        <p className="mt-1 text-lg opacity-90">{ORDER_STEPS[step]!.detail}</p>
      </div>

      {!delivered && (
        <Card className="mt-4 flex items-center gap-4">
          <KeyRound className="size-8 shrink-0 text-seal" />
          <div className="flex-1">
            <p className="text-base text-muted-foreground">Tell this code to the delivery partner</p>
            <p className="font-display text-3xl font-bold tracking-[0.3em]">{order.deliveryOtp}</p>
          </div>
        </Card>
      )}

      <ol className="mt-6 space-y-0">
        {ORDER_STEPS.map((s, i) => {
          const reached = i <= step;
          return (
            <li key={s.title} className="relative flex gap-4 pb-6 last:pb-0">
              {i < ORDER_STEPS.length - 1 && (
                <span className={cn("absolute left-[1.15rem] top-10 h-[calc(100%-2.5rem)] w-1 rounded-full", i < step ? "bg-primary" : "bg-border")} />
              )}
              <span
                className={cn(
                  "z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-base font-bold",
                  reached ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground",
                )}
              >
                {reached ? <Check className="size-5" strokeWidth={3} /> : i + 1}
              </span>
              <div className="pt-1.5">
                <p className={cn("text-lg font-bold", !reached && "text-muted-foreground")}>{s.title}</p>
                {i === step && <p className="text-base text-muted-foreground">{s.detail}</p>}
              </div>
            </li>
          );
        })}
      </ol>

      {step === 3 && (
        <a href="tel:+919830000000" className="tap mt-6 flex items-center justify-center gap-2 rounded-2xl border-2 bg-card text-lg font-semibold">
          <Phone className="size-5 text-primary" /> Call delivery partner (Ravi)
        </a>
      )}

      <SectionTitle>Items</SectionTitle>
      <Card className="divide-y p-0">
        {order.lines.map((l) => {
          const m = getMedicine(l.medicineId);
          if (!m) return null;
          return (
            <div key={l.medicineId} className="flex justify-between gap-3 p-4 text-lg">
              <span>{m.name} {m.strength} × {l.qty}</span>
              <span className="font-semibold">{rupees(m.price * l.qty)}</span>
            </div>
          );
        })}
        <div className="flex justify-between p-4 text-xl font-bold">
          <span>Total</span>
          <span>{rupees(order.total)}</span>
        </div>
      </Card>
    </AppShell>
  );
}
