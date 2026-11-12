import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BadgeCheck, Clock, Pill, ShoppingBag, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { CertifiedBadge, QtyStepper, RxBadge } from "@/components/app/bits";
import { Button } from "@/components/ui/button";
import { getDoctor, getHospital, getMedicine, rupees } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/medicine/$medicineId")({
  loader: ({ params }) => {
    const medicine = getMedicine(params.medicineId);
    if (!medicine) throw notFound();
    return { medicine, hospital: getHospital(medicine.hospitalId)! };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.medicine.name} ${loaderData.medicine.strength} — MediTrust` : "Medicine — MediTrust";
    const desc = loaderData
      ? `${loaderData.medicine.name} from ${loaderData.hospital.name}'s pharmacy, delivered home.`
      : "Certified hospital medicine, delivered home.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: () => (
    <AppShell title="Not found" showBack>
      <p className="text-lg">We could not find this medicine.</p>
      <Link to="/search" className="mt-4 inline-block text-lg font-semibold text-primary underline">Search again</Link>
    </AppShell>
  ),
  component: MedicinePage,
});

function MedicinePage() {
  const { medicine, hospital } = Route.useLoaderData();
  const { qtyOf, setQty, hydrated, cartCount } = useStore();
  const qty = hydrated ? qtyOf(medicine.id) : 0;
  const docs = medicine.doctorIds.map(getDoctor).filter((d) => !!d);

  return (
    <AppShell
      title="Medicine"
      showBack
      actionBar={
        qty > 0 ? (
          <div className="flex items-center justify-between gap-3">
            <QtyStepper qty={qty} onChange={(n) => setQty(medicine.id, n)} size="lg" label={medicine.name} />
            <Button asChild variant="hero" size="xl" className="flex-1">
              <Link to="/cart">
                <ShoppingBag /> Cart ({cartCount})
              </Link>
            </Button>
          </div>
        ) : (
          <Button
            variant="hero"
            size="xl"
            className="w-full"
            onClick={() => {
              setQty(medicine.id, 1);
              toast.success(`${medicine.name} added to cart`);
            }}
          >
            Add to cart · {rupees(medicine.price)}
          </Button>
        )
      }
    >
      <div className="flex flex-col items-center rounded-3xl bg-primary-soft px-5 py-8 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-card text-primary shadow-card">
          <Pill className="size-10" />
        </span>
        <h2 className="mt-4 text-3xl font-bold">{medicine.name}</h2>
        <p className="text-xl text-muted-foreground">{medicine.strength} · {medicine.pack}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <CertifiedBadge />
          {medicine.rx && <RxBadge />}
        </div>
      </div>

      <div className="mt-5 flex items-baseline gap-3">
        <span className="text-3xl font-bold">{rupees(medicine.price)}</span>
        <span className="text-lg text-muted-foreground line-through">{rupees(medicine.mrp)}</span>
        <span className="rounded-full bg-success-soft px-2.5 py-0.5 text-base font-semibold text-success">
          Save {rupees(medicine.mrp - medicine.price)}
        </span>
      </div>

      <dl className="mt-5 divide-y rounded-2xl border bg-card shadow-card">
        <div className="flex gap-3 p-4">
          <BadgeCheck className="mt-0.5 size-6 shrink-0 text-primary" />
          <div>
            <dt className="text-base text-muted-foreground">Used for</dt>
            <dd className="text-lg font-semibold">{medicine.use}</dd>
          </div>
        </div>
        <div className="flex gap-3 p-4">
          <Clock className="mt-0.5 size-6 shrink-0 text-primary" />
          <div>
            <dt className="text-base text-muted-foreground">Usually taken</dt>
            <dd className="text-lg font-semibold">{medicine.howToTake}</dd>
            <dd className="mt-1 text-base text-muted-foreground">Always follow your own doctor's advice.</dd>
          </div>
        </div>
        <div className="flex gap-3 p-4">
          <Stethoscope className="mt-0.5 size-6 shrink-0 text-primary" />
          <div>
            <dt className="text-base text-muted-foreground">From the pharmacy of</dt>
            <dd>
              <Link to="/hospital/$hospitalId" params={{ hospitalId: hospital.id }} className="text-lg font-semibold text-primary underline-offset-4 hover:underline">
                {hospital.name}
              </Link>
            </dd>
            <dd className="mt-1 text-base text-muted-foreground">Given by {docs.map((d) => d.name).join(", ")}</dd>
          </div>
        </div>
      </dl>
    </AppShell>
  );
}
