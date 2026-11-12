import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { ChevronRight, ClipboardList, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { Card } from "@/components/app/bits";
import { Button } from "@/components/ui/button";
import { getMedicine, rupees } from "@/lib/data";
import { ORDER_STEPS, orderStep } from "@/lib/orders";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders/")({
  head: () => ({
    meta: [
      { title: "My orders — MediTrust" },
      { name: "description", content: "Track your medicine deliveries and repeat past orders." },
      { property: "og:title", content: "My orders — MediTrust" },
      { property: "og:description", content: "Track your medicine deliveries and repeat past orders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const { orders, hydrated, reorder } = useStore();
  const [now, setNow] = useState(0);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(t);
  }, []);

  if (!hydrated || !now) return <AppShell title="My orders">{null}</AppShell>;

  return (
    <AppShell title="My orders">
      {orders.length === 0 && (
        <div className="mt-10 flex flex-col items-center text-center">
          <ClipboardList className="size-12 text-muted-foreground" />
          <p className="mt-3 text-xl font-semibold">No orders yet</p>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {orders.map((o) => {
          const step = orderStep(o, now);
          const done = step === ORDER_STEPS.length - 1;
          const names = o.lines.map((l) => getMedicine(l.medicineId)?.name).filter(Boolean).join(", ");
          return (
            <Card key={o.id}>
              <Link to="/orders/$orderId" params={{ orderId: o.id }} className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "inline-block rounded-full px-3 py-0.5 text-sm font-bold",
                      done ? "bg-success-soft text-success" : "bg-seal-soft text-seal-foreground",
                    )}
                  >
                    {ORDER_STEPS[step]!.title}
                  </span>
                  <p className="mt-2 text-lg font-bold leading-snug">{names}</p>
                  <p className="text-base text-muted-foreground">
                    {format(o.createdAt, "d MMM, h:mm a")} · {rupees(o.total)}
                  </p>
                </div>
                <ChevronRight className="mt-1 size-6 text-muted-foreground" />
              </Link>
              {done && (
                <Button
                  variant="soft"
                  size="lg"
                  className="mt-3 h-12 w-full text-lg"
                  onClick={() => {
                    reorder(o.id);
                    toast.success("Added to cart again");
                  }}
                >
                  <RotateCcw /> Order again
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
