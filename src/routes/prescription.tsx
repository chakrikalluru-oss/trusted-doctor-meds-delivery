import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, CheckCircle2, ImageUp, ShieldCheck, Trash2 } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { Card } from "@/components/app/bits";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/prescription")({
  head: () => ({
    meta: [
      { title: "Send your prescription — MediTrust" },
      { name: "description", content: "Take a photo of your doctor's prescription. A licensed pharmacist checks it before delivery." },
      { property: "og:title", content: "Send your prescription — MediTrust" },
      { property: "og:description", content: "Take a photo of your doctor's prescription. A licensed pharmacist checks it before delivery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrescriptionPage,
});

function PrescriptionPage() {
  const { prescription, setPrescription, cart } = useStore();
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const onFile = (file?: File) => {
    if (!file) return;
    setPrescription({ fileName: file.name, addedAt: Date.now() });
    toast.success("Prescription added");
  };

  return (
    <AppShell title="Prescription" showBack>
      <p className="text-lg text-muted-foreground">
        Take a clear photo of the full page your doctor wrote. Make sure the doctor's name and signature are visible.
      </p>

      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      <input ref={galleryRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />

      {prescription ? (
        <Card className="mt-5 flex items-center gap-3 border-success/40 bg-success-soft">
          <CheckCircle2 className="size-8 shrink-0 text-success" />
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold">Prescription added</p>
            <p className="truncate text-base text-muted-foreground">{prescription.fileName}</p>
          </div>
          <button onClick={() => setPrescription(null)} aria-label="Remove prescription" className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-card">
            <Trash2 className="size-5" />
          </button>
        </Card>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          <button onClick={() => cameraRef.current?.click()} className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-primary bg-primary-soft px-5 py-10 text-accent-foreground">
            <Camera className="size-12" />
            <span className="text-xl font-bold">Take a photo</span>
          </button>
          <Button variant="quiet" size="xl" onClick={() => galleryRef.current?.click()}>
            <ImageUp /> Choose from phone
          </Button>
        </div>
      )}

      <div className="mt-6 flex items-start gap-3 rounded-2xl bg-seal-soft p-4 text-seal-foreground">
        <ShieldCheck className="mt-0.5 size-6 shrink-0 text-seal" />
        <p className="text-base">A licensed pharmacist checks every prescription before medicines leave the hospital. Your prescription is kept private.</p>
      </div>

      {prescription && (
        <Button variant="hero" size="xl" className="mt-6 w-full" onClick={() => navigate({ to: cart.length ? "/cart" : "/" })}>
          {cart.length ? "Back to cart" : "Done"}
        </Button>
      )}
    </AppShell>
  );
}
