import { Link } from "@tanstack/react-router";
import { ChevronRight, Stethoscope } from "lucide-react";

export function HospitalLink({ id, name, meta }: { id: string; name: string; meta: string }) {
  return (
    <Link
      to="/hospital/$hospitalId"
      params={{ hospitalId: id }}
      className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-card transition-colors hover:border-primary/40"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <Stethoscope className="size-7" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-bold leading-snug">{name}</span>
        <span className="block text-base text-muted-foreground">{meta}</span>
      </span>
      <ChevronRight className="size-6 shrink-0 text-muted-foreground" />
    </Link>
  );
}
