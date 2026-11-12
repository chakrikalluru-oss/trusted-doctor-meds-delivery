import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Search, Stethoscope, X } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/app/app-shell";
import { SectionTitle } from "@/components/app/bits";
import { MedicineGrid } from "@/components/app/medicine-card";
import { getCategory, hospitals, medicines } from "@/lib/data";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search medicines — MediTrust" },
      { name: "description", content: "Find certified medicines and partner hospitals near you." },
      { property: "og:title", content: "Search medicines — MediTrust" },
      { property: "og:description", content: "Find certified medicines and partner hospitals near you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SearchPage,
});

const COMMON = ["Sugar", "Blood pressure", "Fever", "Cough", "Acidity", "Pain"];

function SearchPage() {
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const meds = term
    ? medicines.filter((m) => `${m.name} ${m.use} ${getCategory(m.category)?.label ?? ""}`.toLowerCase().includes(term))
    : [];
  const hosp = term ? hospitals.filter((h) => `${h.name} ${h.area}`.toLowerCase().includes(term)) : [];

  return (
    <AppShell title="Search">
      <label className="flex h-16 items-center gap-3 rounded-2xl border-2 border-primary bg-card px-4">
        <Search className="size-6 text-primary" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Medicine name or illness"
          aria-label="Search medicines"
          className="h-full flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
        />
        {q && (
          <button onClick={() => setQ("")} aria-label="Clear search" className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <X className="size-5" />
          </button>
        )}
      </label>

      {!term && (
        <>
          <SectionTitle>Common searches</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {COMMON.map((c) => (
              <button key={c} onClick={() => setQ(c)} className="tap rounded-full border-2 bg-card px-5 text-lg font-semibold">
                {c}
              </button>
            ))}
          </div>
        </>
      )}

      {hosp.length > 0 && (
        <>
          <SectionTitle>Hospitals</SectionTitle>
          <div className="flex flex-col gap-3">
            {hosp.map((h) => (
              <Link key={h.id} to="/hospital/$hospitalId" params={{ hospitalId: h.id }} className="flex items-center gap-3 rounded-2xl border bg-card p-4 text-lg font-bold shadow-card">
                <Stethoscope className="size-6 text-primary" /> {h.name}
              </Link>
            ))}
          </div>
        </>
      )}

      {meds.length > 0 && (
        <>
          <SectionTitle>Medicines</SectionTitle>
          <MedicineGrid items={meds} showHospital />
        </>
      )}

      {term && meds.length === 0 && hosp.length === 0 && (
        <div className="mt-8 rounded-2xl bg-muted p-6 text-center">
          <p className="text-lg font-semibold">We could not find “{q}”.</p>
          <p className="mt-1 text-base text-muted-foreground">Send a photo of your prescription and we will find it for you.</p>
          <Link to="/prescription" className="tap mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 text-lg font-semibold text-primary-foreground">
            <Camera className="size-5" /> Send prescription
          </Link>
        </div>
      )}
    </AppShell>
  );
}
