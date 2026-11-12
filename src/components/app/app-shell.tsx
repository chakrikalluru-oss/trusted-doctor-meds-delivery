import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ClipboardList, Home, Search, ShoppingBag, User } from "lucide-react";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  showBack?: boolean;
  children: ReactNode;
  actionBar?: ReactNode;
  hideNav?: boolean;
};

export function AppShell({ title, showBack, children, actionBar, hideNav }: Props) {
  const router = useRouter();
  const goBack = () => {
    if (window.history.length > 1) router.history.back();
    else router.navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col bg-background shadow-card">
        {title && (
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur">
            {showBack && (
              <button
                onClick={goBack}
                aria-label="Go back"
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-foreground transition-colors hover:bg-accent"
              >
                <ArrowLeft className="size-6" />
              </button>
            )}
            <h1 className="text-xl font-semibold">{title}</h1>
          </header>
        )}

        <main className={cn("flex-1 px-5 pt-4", actionBar ? "pb-52" : "pb-32")}>{children}</main>

        {actionBar && (
          <div
            className={cn(
              "fixed inset-x-0 z-30 mx-auto max-w-md border-t bg-card px-5 py-4 shadow-bar",
              hideNav ? "bottom-0" : "bottom-[4.75rem]",
            )}
          >
            {actionBar}
          </div>
        )}

        {!hideNav && <BottomNav />}
      </div>
    </div>
  );
}

function BottomNav() {
  const { cartCount, hydrated } = useStore();
  const items = [
    { to: "/", label: "Home", icon: Home, exact: true },
    { to: "/search", label: "Search", icon: Search, exact: false },
    { to: "/cart", label: "Cart", icon: ShoppingBag, exact: false },
    { to: "/orders", label: "Orders", icon: ClipboardList, exact: false },
    { to: "/account", label: "Me", icon: User, exact: false },
  ] as const;

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto grid h-[4.75rem] max-w-md grid-cols-5 border-t bg-card"
    >
      {items.map(({ to, label, icon: Icon, exact }) => (
        <Link
          key={to}
          to={to}
          activeOptions={{ exact }}
          className="group relative flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors data-[status=active]:text-primary"
        >
          <span className="relative flex h-8 w-14 items-center justify-center rounded-full transition-colors group-data-[status=active]:bg-primary-soft">
            <Icon className="size-6" strokeWidth={2.2} />
            {to === "/cart" && hydrated && cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rx px-1 text-xs font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </span>
          <span className="text-sm font-semibold">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
