import {
  Baby,
  Bone,
  BriefcaseMedical,
  Droplet,
  Flame,
  HeartPulse,
  Pill,
  Sun,
  Thermometer,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "@/lib/data";

const ICONS: Record<CategoryId, LucideIcon> = {
  "fever-pain": Thermometer,
  "cold-cough": Wind,
  acidity: Flame,
  allergy: Sun,
  sugar: Droplet,
  "bp-heart": HeartPulse,
  vitamins: Pill,
  "baby-care": Baby,
  "bone-joint": Bone,
  "first-aid": BriefcaseMedical,
};

export function CategoryIcon({ id, className }: { id: CategoryId; className?: string }) {
  const Icon = ICONS[id] ?? Pill;
  return <Icon className={className} strokeWidth={2} />;
}
