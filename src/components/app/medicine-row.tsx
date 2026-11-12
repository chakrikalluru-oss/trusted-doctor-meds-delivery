import { Link } from "@tanstack/react-router";
import { Pill, Plus } from "lucide-react";
import { getHospital, rupees, type Medicine } from "@/lib/data";
import { useStore } from "@/lib/store";
import { QtyStepper, RxBadge } from "./bits";
import { toast } from "sonner";

export function MedicineRow({ medicine, showHospital }: { medicine: Medicine; showHospital?: boolean }) {
  const { qtyOf, setQty, hydrated } = useStore();
  const qty = hydrated ? qtyOf(medicine.id) : 0;
  const hospital = getHospital(medicine.hospitalId);

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-card">
      <Link
        to="/medicine/$medicineId"
        params={{ medicineId: medicine.id }}
        className="flex items-start gap-4"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Pill className="size-7" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-lg font-bold leading-snug">
            {medicine.name} <span className="font-normal text-muted-foreground">{medicine.strength}</span>
          </span>
          <span className="block text-base text-muted-foreground">
            For {medicine.use.toLowerCase()} · {medicine.pack}
          </span>
          {showHospital && hospital && (
            <span className="mt-0.5 block text-sm font-semibold text-accent-foreground">From {hospital.name}</span>
          )}
          {medicine.rx && <RxBadge className="mt-2" />}
        </span>
      </Link>
      <div className="mt-3 flex items-center justify-between gap-3 border-t pt-3">
        <span className="flex items-baseline gap-2">
          <span className="text-xl font-bold">{rupees(medicine.price)}</span>
          <span className="text-base text-muted-foreground line-through">{rupees(medicine.mrp)}</span>
        </span>
        {qty > 0 ? (
          <QtyStepper qty={qty} onChange={(n) => setQty(medicine.id, n)} label={medicine.name} />
        ) : (
          <button
            onClick={() => {
              setQty(medicine.id, 1);
              toast.success(`${medicine.name} added to cart`);
            }}
            className="flex h-12 items-center gap-2 rounded-xl bg-primary px-5 text-lg font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            <Plus className="size-5" strokeWidth={2.6} /> Add
          </button>
        )}
      </div>
    </div>
  );
}
