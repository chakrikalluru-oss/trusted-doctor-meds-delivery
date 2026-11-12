import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app/app-shell";
import { MedicineGrid } from "@/components/app/medicine-card";
import { getCategory, medicinesIn } from "@/lib/data";

export const Route = createFileRoute("/category/$categoryId")({
  loader: ({ params }) => {
    const category = getCategory(params.categoryId);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    const label = loaderData?.category.label ?? "Category";
    const desc = `Certified ${label.toLowerCase()} medicines from your hospitals, delivered home.`;
    return {
      meta: [
        { title: `${label} medicines — MediTrust` },
        { name: "description", content: desc },
        { property: "og:title", content: `${label} medicines — MediTrust` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: () => (
    <AppShell title="Not found" showBack>
      <p className="text-lg">This category does not exist.</p>
      <Link to="/categories" className="mt-4 inline-block text-lg font-semibold text-primary underline">See all categories</Link>
    </AppShell>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const items = medicinesIn(category.id);
  return (
    <AppShell title={category.label} showBack>
      <p className="mb-4 text-base text-muted-foreground">
        {items.length} medicines from your hospitals' pharmacies
      </p>
      <MedicineGrid items={items} showHospital />
    </AppShell>
  );
}
