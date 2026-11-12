import { Link } from "@tanstack/react-router";
import type { Category, CategoryId } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "./category-icon";

function Tile({ category, active }: { category: Category; active?: boolean }) {
  return (
    <>
      <span
        className={cn(
          "flex aspect-square w-full items-center justify-center rounded-2xl border transition-colors",
          active ? "border-primary bg-primary text-primary-foreground shadow-lift" : "bg-card text-primary",
        )}
      >
        <CategoryIcon id={category.id} className="size-8" />
      </span>
      <span className="mt-2 block break-words text-center text-sm font-medium leading-tight">{category.label}</span>
    </>
  );
}

/** Health-need tiles. Pass onSelect to filter in place (Home) or omit to link to the category page. */
export function CategoryGrid({
  items,
  selected,
  onSelect,
}: {
  items: Category[];
  selected?: CategoryId | null;
  onSelect?: (id: CategoryId) => void;
}) {
  const { textScale } = useStore();
  return (
    <div className={cn("grid gap-x-3 gap-y-4", textScale === "xlarge" ? "grid-cols-3" : "grid-cols-4")}>
      {items.map((c) =>
        onSelect ? (
          <button key={c.id} onClick={() => onSelect(c.id)} aria-pressed={selected === c.id} className="flex flex-col items-center">
            <Tile category={c} active={selected === c.id} />
          </button>
        ) : (
          <Link key={c.id} to="/category/$categoryId" params={{ categoryId: c.id }} className="flex flex-col items-center">
            <Tile category={c} />
          </Link>
        ),
      )}
    </div>
  );
}
