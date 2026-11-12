import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, MapPin, Phone, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/app/app-shell";
import { CertifiedBadge, SectionTitle } from "@/components/app/bits";
import { MedicineRow } from "@/components/app/medicine-row";
import { doctorsAt, getHospital, medicinesAt } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/hospital/$hospitalId")({
  loader: ({ params }) => {
    const hospital = getHospital(params.hospitalId);
    if (!hospital) throw notFound();
    return { hospital };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.hospital.name ?? "Hospital";
    const desc = `Certified medicines from ${name}'s own pharmacy, delivered home.`;
    return {
      meta: [
        { title: `${name} pharmacy — MediTrust` },
        { name: "description", content: desc },
        { property: "og:title", content: `${name} pharmacy — MediTrust` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: () => (
    <AppShell title="Not found" showBack>
      <p className="text-lg">This hospital is not on MediTrust yet.</p>
      <Link to="/" className="mt-4 inline-block text-lg font-semibold text-primary underline">Go home</Link>
    </AppShell>
  ),
  component: HospitalPage,
});

function HospitalPage() {
  const { hospital } = Route.useLoaderData();
  const docs = doctorsAt(hospital.id);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const meds = medicinesAt(hospital.id).filter((m) => !doctorId || m.doctorIds.includes(doctorId));

  return (
    <AppShell title="Hospital pharmacy" showBack>
      <div className="rounded-3xl bg-primary p-5 text-primary-foreground shadow-lift">
        <h2 className="text-2xl font-bold">{hospital.name}</h2>
        <p className="mt-1 flex items-center gap-1.5 text-base opacity-90">
          <MapPin className="size-4" /> {hospital.area} · {hospital.distanceKm} km away
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-base">
          <span className="flex items-center gap-2 rounded-xl bg-primary-foreground/12 px-3 py-2">
            <Clock className="size-5" /> ~{hospital.etaMins} min
          </span>
          <a href={`tel:${hospital.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 rounded-xl bg-primary-foreground/12 px-3 py-2 font-semibold">
            <Phone className="size-5" /> Call
          </a>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-2xl bg-seal-soft p-4 text-seal-foreground">
        <ShieldCheck className="mt-0.5 size-6 shrink-0 text-seal" />
        <p className="text-base">
          <strong>Same medicine, same source.</strong> Packed and sealed by this hospital's licensed pharmacy (Licence {hospital.licence}). {hospital.pharmacyHours}.
        </p>
      </div>

      <SectionTitle>Doctors here</SectionTitle>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        <button
          onClick={() => setDoctorId(null)}
          className={cn("tap shrink-0 rounded-full border-2 px-5 text-lg font-semibold", !doctorId ? "border-primary bg-primary text-primary-foreground" : "bg-card")}
        >
          All medicines
        </button>
        {docs.map((d) => (
          <button
            key={d.id}
            onClick={() => setDoctorId(d.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border-2 py-1.5 pl-1.5 pr-4 text-left",
              doctorId === d.id ? "border-primary bg-primary text-primary-foreground" : "bg-card",
            )}
          >
            <span className={cn("flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold", doctorId === d.id ? "bg-primary-foreground text-primary" : "bg-accent text-accent-foreground")}>
              {d.initials}
            </span>
            <span className="leading-tight">
              <span className="block text-base font-bold">{d.name}</span>
              <span className={cn("block text-sm", doctorId === d.id ? "opacity-90" : "text-muted-foreground")}>{d.specialty}</span>
            </span>
          </button>
        ))}
      </div>

      <SectionTitle action={<CertifiedBadge label="Certified" />}>Medicines</SectionTitle>
      <div className="flex flex-col gap-3">
        {meds.map((m) => (
          <MedicineRow key={m.id} medicine={m} />
        ))}
      </div>
    </AppShell>
  );
}
