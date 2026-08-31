import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  UploadCloud,
  MessagesSquare,
  Landmark,
  BarChart3,
  Bell,
  Search,
  ChevronRight,
} from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { title: "Dashboard", to: "/", icon: LayoutDashboard },
  { title: "Upload & Process", to: "/upload", icon: UploadCloud },
  { title: "Ask AnthraCore", to: "/ask", icon: MessagesSquare },
  { title: "Parliamentary Reports", to: "/parliamentary-reports", icon: Landmark },
  { title: "Insights", to: "/insights", icon: BarChart3 },
] as const;

export function Wordmark() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-sm bg-primary font-mono text-sm font-bold text-primary-foreground">
        AC
      </span>
      <span className="text-[1.0625rem] font-semibold tracking-tight text-navy-foreground">
        Anthra<span className="text-primary">Core</span>
      </span>
    </Link>
  );
}

export function AppShell({
  title,
  subtitle,
  breadcrumb,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-navy">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-navy-border bg-navy px-5">
        <div className="flex items-center gap-8">
          <Wordmark />
          <span className="hidden label-caps text-navy-muted md:inline">
            CMPDI · Coal India Ltd · Document Intelligence
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-sm border border-navy-border px-2.5 py-1.5 lg:flex">
            <Search className="size-3.5 text-navy-muted" />
            <input
              placeholder="Search 12,480 documents"
              className="w-52 bg-transparent text-xs text-navy-foreground outline-none placeholder:text-navy-muted"
            />
          </div>
          <button
            aria-label="Notifications"
            className="relative rounded-sm border border-navy-border p-1.5 text-navy-muted transition-colors hover:text-navy-foreground"
          >
            <Bell className="size-4" />
            <span className="absolute right-1 top-1 size-1.5 rounded-full bg-primary" />
          </button>
          <div className="flex items-center gap-2 border-l border-navy-border pl-3">
            <span className="flex size-7 items-center justify-center rounded-full bg-navy-border text-[0.6875rem] font-semibold text-navy-foreground">
              RK
            </span>
            <div className="hidden leading-tight sm:block">
              <p className="text-xs font-medium text-navy-foreground">R. Kesarwani</p>
              <p className="text-[0.6875rem] text-navy-muted">Sr. Geologist, RI-III</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 flex-col justify-between border-r border-navy-border bg-navy px-3 py-5 md:flex">
          <nav className="space-y-1">
            {nav.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    active
                      ? "flex items-center gap-2.5 rounded-sm border-l-2 border-primary bg-sidebar-accent px-3 py-2 text-sm font-medium text-navy-foreground"
                      : "flex items-center gap-2.5 rounded-sm border-l-2 border-transparent px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-navy-foreground"
                  }
                >
                  <item.icon className={active ? "size-4 text-primary" : "size-4 text-navy-muted"} />
                  {item.title}
                </Link>
              );
            })}
          </nav>
          <div className="rounded-sm border border-navy-border p-3">
            <p className="label-caps text-primary">Demo build</p>
            <p className="mt-1.5 text-xs leading-relaxed text-navy-muted">
              Prototype environment. All extractions and answers use simulated corpus data.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-background">
          <div className="border-b border-border bg-card px-6 py-5">
            {breadcrumb ? (
              <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>AnthraCore</span>
                <ChevronRight className="size-3" />
                <span className="text-foreground">{breadcrumb}</span>
              </div>
            ) : null}
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
                {subtitle ? (
                  <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
                ) : null}
              </div>
              {actions}
            </div>
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
