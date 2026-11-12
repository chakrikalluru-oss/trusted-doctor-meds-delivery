import { BadgeCheck, FileText, Minus, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function CertifiedBadge({ className, label = "Hospital certified" }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-seal-soft px-3 py-1 text-sm font-semibold text-seal-foreground",
        className,
      )}
    >
      <BadgeCheck className="size-4 text-seal" strokeWidth={2.5} />
      {label}
    </span>
  );
}

export function RxBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-rx-soft px-2.5 py-0.5 text-sm font-semibold text-rx",
        className,
      )}
    >
      <FileText className="size-3.5" strokeWidth={2.5} />
      Needs prescription
    </span>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-4 mt-8 flex items-end justify-between gap-3">
      <h2 className="text-2xl font-bold">{children}</h2>
      {action}
    </div>
  );
}

export function QtyStepper({
  qty,
  onChange,
  size = "md",
  label,
  block,
}: {
  qty: number;
  onChange: (n: number) => void;
  size?: "sm" | "md" | "lg";
  label: string;
  block?: boolean;
}) {
  const btn = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-10 w-10" : "h-12 w-12";
  return (
    <div
      className={cn("items-center gap-1 rounded-xl bg-primary-soft p-1", block ? "flex w-full justify-between" : "inline-flex")}
      role="group"
      aria-label={`Quantity of ${label}`}
    >
      <button
        onClick={() => onChange(qty - 1)}
        aria-label={`Remove one ${label}`}
        className={cn(btn, "flex items-center justify-center rounded-xl bg-card text-primary shadow-card")}
      >
        <Minus className="size-5" strokeWidth={2.6} />
      </button>
      <span className="min-w-8 text-center text-lg font-bold text-accent-foreground" aria-live="polite">
        {qty}
      </span>
      <button
        onClick={() => onChange(qty + 1)}
        aria-label={`Add one more ${label}`}
        className={cn(btn, "flex items-center justify-center rounded-xl bg-primary text-primary-foreground")}
      >
        <Plus className="size-5" strokeWidth={2.6} />
      </button>
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-2xl border bg-card p-4 shadow-card", className)}>{children}</div>;
}
