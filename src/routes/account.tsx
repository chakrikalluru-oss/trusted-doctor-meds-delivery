import { createFileRoute } from "@tanstack/react-router";
import { Bell, HeartHandshake, Languages, MapPin, Phone, Type } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/app/app-shell";
import { Card, SectionTitle } from "@/components/app/bits";
import { Switch } from "@/components/ui/switch";
import { useStore, type TextScale } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My account — MediTrust" },
      { name: "description", content: "Your address, family helper, reminders and text size." },
      { property: "og:title", content: "My account — MediTrust" },
      { property: "og:description", content: "Your address, family helper, reminders and text size." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccountPage,
});

const SCALES: { id: TextScale; label: string; size: string }[] = [
  { id: "normal", label: "Normal", size: "text-lg" },
  { id: "large", label: "Large", size: "text-xl" },
  { id: "xlarge", label: "Largest", size: "text-2xl" },
];

function AccountPage() {
  const { profile, textScale, setTextScale } = useStore();
  const [reminders, setReminders] = useState(true);

  return (
    <AppShell title="Me">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary font-display text-2xl font-bold text-primary-foreground">
          {profile.name.split(" ").map((p) => p[0]).join("")}
        </span>
        <div>
          <p className="text-2xl font-bold">{profile.name}</p>
          <p className="text-lg text-muted-foreground">{profile.phone}</p>
        </div>
      </div>

      <SectionTitle>
        <span className="flex items-center gap-2"><Type className="size-6 text-primary" /> Text size</span>
      </SectionTitle>
      <div role="radiogroup" aria-label="Text size" className="grid grid-cols-3 gap-2">
        {SCALES.map((s) => (
          <button
            key={s.id}
            role="radio"
            aria-checked={textScale === s.id}
            onClick={() => setTextScale(s.id)}
            className={cn(
              "flex h-20 flex-col items-center justify-center rounded-2xl border-2 font-semibold",
              textScale === s.id ? "border-primary bg-primary-soft text-accent-foreground" : "bg-card",
            )}
          >
            <span className={cn("font-display font-bold", s.size)}>Aa</span>
            <span className="text-sm">{s.label}</span>
          </button>
        ))}
      </div>

      <SectionTitle>Settings</SectionTitle>
      <Card className="divide-y p-0">
        <Item icon={MapPin} title="Home address" sub={profile.address} />
        <Item icon={HeartHandshake} title="Family helper" sub="Let your son or daughter order and pay for you" />
        <div className="flex items-center gap-4 p-4">
          <Bell className="size-6 shrink-0 text-primary" />
          <div className="flex-1">
            <p className="text-lg font-semibold">Refill reminders</p>
            <p className="text-base text-muted-foreground">We remind you before medicines run out</p>
          </div>
          <Switch checked={reminders} onCheckedChange={setReminders} aria-label="Refill reminders" className="scale-125" />
        </div>
        <Item icon={Languages} title="Language" sub="English · हिन्दी · বাংলা" />
      </Card>

      <a href="tel:+918000000000" className="tap mt-6 flex items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-semibold text-primary-foreground shadow-lift">
        <Phone className="size-5" /> Call us for help
      </a>
    </AppShell>
  );
}

function Item({ icon: Icon, title, sub }: { icon: typeof MapPin; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-4 p-4">
      <Icon className="size-6 shrink-0 text-primary" />
      <div>
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-base text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}
