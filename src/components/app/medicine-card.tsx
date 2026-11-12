import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getCategory, getHospital, rupees, type Medicine } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { QtyStepper } from "./bits";
import { CategoryIcon } from "./category-icon";

export function MedicineCard({ medicine, showHospital }: { medicine: Medicine; showHospital?: boolean }) {
  const { qtyOf, setQty, hydrated } = useStore();
  const qty = hydrated ? qtyOf(medicine.id) : 0;
  const category = getCategory(medicine.category);
  const hospital = getHospital(medicine.hospitalId);

  return (
    <div className="flex min-w-0 flex-col rounded-2xl border bg-card p-3 shadow-card">
      <Link to="/medicine/$medicineId" params={{ medicineId: medicine.id }} className="block min-w-0">
        <span className="relative flex aspect-[4/3] items-center justify-center rounded-xl bg-primary-soft text-primary">
          <CategoryIcon id={medicine.category} className="size-10" />
          {medicine.rx && (
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-card px-2 py-0.5 text-xs font-bold text-rx">
              <FileText className="size-3" strokeWidth={2.6} /> Prescription
            </span>
          )}
        </span>
        <span className="mt-3 block truncate text-sm font-semibold text-primary">{category?.label}</span>
        <span className="block text-lg font-bold leading-snug">
          {medicine.name} {medicine.strength}
        </span>
        <span className="block text-sm text-muted-foreground">{medicine.pack}</span>
        {showHospital && hospital && (
          <span className="mt-0.5 block truncate text-sm text-muted-foreground">{hospital.name}</span>
        )}
      </Link>

      <div className="mt-auto pt-3">
        <p className="mb-2 flex items-baseline gap-1.5">
          <span className="text-xl font-bold">{rupees(medicine.price)}</span>
          <span className="text-sm text-muted-foreground line-through">{rupees(medicine.mrp)}</span>
        </p>
        {qty > 0 ? (
          <QtyStepper qty={qty} onChange={(n) => setQty(medicine.id, n)} label={medicine.name} size="sm" block />
        ) : (
          <Button
            variant="outline-primary"
            className="h-12 w-full rounded-xl text-base font-bold tracking-wide"
            onClick={() => {
              setQty(medicine.id, 1);
              toast.success(`${medicine.name} added to cart`);
            }}
          >
            ADD
          </Button>
        )}
      </div>
    </div>
  );
}

/** Two-column product grid like the store mockup; drops to one column at the largest text size. */
export function MedicineGrid({ items, showHospital }: { items: Medicine[]; showHospital?: boolean }) {
  const { textScale } = useStore();
  return (
    <div className={cn("grid gap-3", textScale === "xlarge" ? "grid-cols-1" : "grid-cols-2")}>
      {items.map((m) => (
        <MedicineCard key={m.id} medicine={m} showHospital={showHospital} />
      ))}
    </div>
  );
}
