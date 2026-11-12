import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, ChevronRight, MapPin, RotateCcw, Search, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import heroImg from "@/assets/home-delivery.jpg";
import { AppShell } from "@/components/app/app-shell";
import { CertifiedBadge, SectionTitle } from "@/components/app/bits";
import { MedicineRow } from "@/components/app/medicine-row";
import { doctorsAt, getMedicine, hospitals } from "@/lib/data";
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
  const { profile, orders, reorder, hydrated } = useStore();
  const lastOrder = hydrated ? orders[0] : undefined;
  const regulars = lastOrder?.lines.map((l) => getMedicine(l.medicineId)).filter((m) => !!m) ?? [];

  return (
    <AppShell>
      <Link to="/account" className="mt-1 inline-flex max-w-full items-center gap-1.5 rounded-xl bg-muted px-3 py-2 text-base font-semibold">
        <MapPin className="size-5 shrink-0 text-primary" />
        <span className="truncate">{profile.address}</span>
      </Link>
      <div className="mt-4">
        <p className="text-lg text-muted-foreground">Hello,</p>
        <h1 className="text-3xl font-bold">{profile.name.split(" ")[0]} ji</h1>
      </div>

      <Link
        to="/search"
        className="mt-5 flex h-16 items-center gap-3 rounded-2xl border-2 border-input bg-card px-5 text-lg text-muted-foreground shadow-card"
      >
        <Search className="size-6 text-primary" />
        Search medicines
      </Link>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link
          to="/prescription"
          className="flex flex-col gap-3 rounded-2xl bg-primary p-4 text-primary-foreground shadow-lift"
        >
          <Camera className="size-8" />
          <span className="text-lg font-bold leading-tight">Send my prescription</span>
        </Link>
        <button
          onClick={() => {
            if (!lastOrder) return;
            reorder(lastOrder.id);
            toast.success("Your last order is in the cart");
          }}
          className="flex flex-col gap-3 rounded-2xl bg-seal-soft p-4 text-left text-seal-foreground"
        >
          <RotateCcw className="size-8 text-seal" />
          <span className="text-lg font-bold leading-tight">Repeat last order</span>
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border bg-card shadow-card">
        <img src={heroImg} alt="A delivery partner handing medicines to an elderly woman at her door" width={1200} height={800} className="aspect-[3/2] w-full object-cover" />
        <div className="p-4">
          <CertifiedBadge />
          <p className="mt-2 text-lg font-semibold leading-snug">
            The exact medicines your hospital gives you — sealed by their pharmacy, brought to your door.
          </p>
        </div>
      </div>

      <SectionTitle>Your hospitals</SectionTitle>
      <div className="flex flex-col gap-3">
        {hospitals.map((h) => (
          <Link
            key={h.id}
            to="/hospital/$hospitalId"
            params={{ hospitalId: h.id }}
            className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-card transition-colors hover:border-primary/40"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <Stethoscope className="size-7" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-lg font-bold leading-snug">{h.name}</span>
              <span className="block text-base text-muted-foreground">
                {doctorsAt(h.id).length} doctors · {h.distanceKm} km · about {h.etaMins} min
              </span>
            </span>
            <ChevronRight className="size-6 text-muted-foreground" />
          </Link>
        ))}
      </div>

      {regulars.length > 0 && (
        <>
          <SectionTitle>Your regular medicines</SectionTitle>
          <div className="flex flex-col gap-3">
            {regulars.map((m) => (
              <MedicineRow key={m.id} medicine={m} showHospital />
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
