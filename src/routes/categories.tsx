import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/app-shell";
import { SectionTitle } from "@/components/app/bits";
import { CategoryGrid } from "@/components/app/category-grid";
import { HospitalLink } from "@/components/app/hospital-link";
import { categories, doctorsAt, hospitals } from "@/lib/data";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — MediTrust" },
      { name: "description", content: "Browse certified medicines by health need or by your hospital." },
      { property: "og:title", content: "Categories — MediTrust" },
      { property: "og:description", content: "Browse certified medicines by health need or by your hospital." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <AppShell title="Categories">
      <h2 className="mb-4 mt-2 text-2xl font-bold">By health need</h2>
      <CategoryGrid items={categories} />

      <SectionTitle>By hospital</SectionTitle>
      <div className="flex flex-col gap-3">
        {hospitals.map((h) => (
          <HospitalLink key={h.id} id={h.id} name={h.name} meta={`${doctorsAt(h.id).length} doctors · ${h.area}`} />
        ))}
      </div>
    </AppShell>
  );
}
