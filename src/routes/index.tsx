import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Camera, ChevronDown, MapPin, RotateCcw, Search, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { SectionTitle } from "@/components/app/bits";
import { CategoryGrid } from "@/components/app/category-grid";
import { HospitalLink } from "@/components/app/hospital-link";
import { MedicineGrid } from "@/components/app/medicine-card";
import { categories, doctorsAt, getCategory, getMedicine, hospitals, medicinesIn, type CategoryId } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediTrust — Your hospital's medicines, delivered home" },
      { name: "description", content: "Order certified medicines from the hospital and doctor you trust, delivered to your door." },
      { property: "og:title", content: "MediTrust — Your hospital's medicines, delivered home" },
      { property: "og:description", content: "Order certified medicines from the hospital and doctor you trust, delivered to your door." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { profile, orders, reorder, hydrated, cartCount } = useStore();
  const [selected, setSelected] = useState<CategoryId | null>(null);
  const lastOrder = hydrated ? orders[0] : undefined;
  const regulars = lastOrder?.lines.map((l) => getMedicine(l.medicineId)).filter((m) => !!m) ?? [];
  const area = profile.address.split(",").pop()?.trim();

  return (
    <AppShell>
      {/* Teal top band: delivery address, cart, search */}
      <div className="-mx-5 -mt-4 bg-primary px-5 pb-6 pt-5 text-primary-foreground">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <Link to="/account" className="min-w-0">
            <span className="block text-base opacity-85">Delivering in 35 mins to</span>
            <span className="flex items-center gap-1.5 text-xl font-bold">
              <MapPin className="size-5 shrink-0" />
              <span className="truncate">Home · {area}</span>
              <ChevronDown className="size-5 shrink-0" />
            </span>
          </Link>
          <Link
            to="/cart"
            aria-label={`Cart, ${cartCount} items`}
            className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/15"
          >
            <ShoppingCart className="size-7" />
            {hydrated && cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-rx px-1 text-sm font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
        <Link
          to="/search"
          className="mt-4 flex h-16 items-center gap-3 rounded-2xl bg-card px-5 text-lg text-muted-foreground"
        >
          <Search className="size-6 shrink-0 text-foreground" />
          <span className="truncate">Search medicines or symptoms</span>
        </Link>
      </div>

      {/* Two big shortcuts */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link to="/prescription" className="flex items-center gap-3 rounded-2xl border bg-card p-3.5 shadow-card">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Camera className="size-6" />
          </span>
          <span className="text-base font-bold leading-tight">Send prescription</span>
        </Link>
        <button
          onClick={() => {
            if (!lastOrder) return;
            reorder(lastOrder.id);
            toast.success("Your last order is in the cart");
          }}
          className="flex items-center gap-3 rounded-2xl border bg-card p-3.5 text-left shadow-card"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <RotateCcw className="size-6" />
          </span>
          <span className="text-base font-bold leading-tight">Repeat last order</span>
        </button>
      </div>

      <SectionTitle
        action={
          selected ? (
            <button onClick={() => setSelected(null)} className="text-lg font-semibold text-primary">
              Clear
            </button>
          ) : (
            <Link to="/categories" className="text-lg font-semibold text-primary">
              See all
            </Link>
          )
        }
      >
        Shop by health need
      </SectionTitle>
      <CategoryGrid items={categories.slice(0, 8)} selected={selected} onSelect={(id) => setSelected(id === selected ? null : id)} />

      {selected ? (
        <>
          <div className="mb-4 mt-8">
            <h2 className="text-2xl font-bold">{getCategory(selected)?.label}</h2>
            <p className="text-base text-muted-foreground">From your hospitals' pharmacies</p>
          </div>
          <MedicineGrid items={medicinesIn(selected)} showHospital />
        </>
      ) : (
        regulars.length > 0 && (
          <>
            <div className="mb-4 mt-8">
              <h2 className="text-2xl font-bold">Your regular medicines</h2>
              <p className="text-base text-muted-foreground">From your last order</p>
            </div>
            <MedicineGrid items={regulars} showHospital />
          </>
        )
      )}

      <SectionTitle>Your hospitals</SectionTitle>
      <div className="mb-3 flex items-start gap-3 rounded-2xl bg-seal-soft p-3.5 text-seal-foreground">
        <BadgeCheck className="mt-0.5 size-6 shrink-0 text-seal" />
        <p className="text-base">The exact medicines your hospital gives you — sealed by their own pharmacy.</p>
      </div>
      <div className="flex flex-col gap-3">
        {hospitals.map((h) => (
          <HospitalLink key={h.id} id={h.id} name={h.name} meta={`${doctorsAt(h.id).length} doctors · ${h.distanceKm} km · ~${h.etaMins} min`} />
        ))}
      </div>
    </AppShell>
  );
}
