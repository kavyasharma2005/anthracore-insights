import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  Zap,
  Target,
  Building2,
  UploadCloud,
  Sparkles,
  ArrowUpRight,
  Landmark,
  FileCheck2,
  AlertTriangle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AnthraCore Document Intelligence" },
      {
        name: "description",
        content:
          "AnthraCore dashboard: document processing, extraction accuracy and recent activity across Coal India Ltd subsidiaries.",
      },
      { property: "og:title", content: "AnthraCore — Dashboard" },
      {
        property: "og:description",
        content:
          "Document processing, extraction accuracy and recent activity across Coal India Ltd subsidiaries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const kpis = [
  {
    label: "Documents Processed",
    value: "1,240",
    sub: "+86 this month",
    icon: FileText,
  },
  {
    label: "Faster Report Prep",
    value: "70%",
    sub: "vs. manual baseline",
    icon: Zap,
  },
  {
    label: "Extraction Accuracy",
    value: "91%",
    sub: "OCR + table grounding",
    icon: Target,
  },
  {
    label: "Subsidiaries Live",
    value: "7/7",
    sub: "ECL · BCCL · CCL · NCL · SECL · MCL · WCL",
    icon: Building2,
  },
];

const coalProduction = [
  { year: "22-23", mt: 703.2 },
  { year: "23-24", mt: 773.8 },
  { year: "24-25", mt: 781.1 },
];

const activity = [
  {
    icon: Landmark,
    title: "Parliamentary query answered",
    detail: "Production trend FY23-24",
    meta: "4.2 sec · 94% confidence",
    time: "2 min ago",
    tone: "accent" as const,
  },
  {
    icon: FileCheck2,
    title: "Report extracted",
    detail: "GR_Korba_Dipka_Block-IV_2024.pdf · 412 pages",
    meta: "6 min 18 sec · 98.1% OCR confidence",
    time: "26 min ago",
    tone: "success" as const,
  },
  {
    icon: UploadCloud,
    title: "Document uploaded",
    detail: "Borehole_Log_Jharia_BH-2291.pdf · BCCL",
    meta: "Queued for text extraction",
    time: "41 min ago",
    tone: "neutral" as const,
  },
  {
    icon: Sparkles,
    title: "Ask AnthraCore answered",
    detail: "Reserve estimate comparison — Amlohri OCP",
    meta: "3.1 sec · 91% confidence",
    time: "1 hr ago",
    tone: "accent" as const,
  },
  {
    icon: AlertTriangle,
    title: "Validation flag raised",
    detail: "Seam nomenclature conflict — Purewa Bottom vs Purewa Lower",
    meta: "Awaiting geologist review",
    time: "2 hrs ago",
    tone: "warn" as const,
  },
];

const activityTone: Record<string, string> = {
  accent: "bg-accent text-accent-foreground",
  success: "bg-success/10 text-success",
  neutral: "bg-secondary text-secondary-foreground",
  warn: "bg-destructive/10 text-destructive",
};

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-md border border-border bg-card shadow-[var(--shadow-card)] ${className}`}
    >
      {children}
    </section>
  );
}

function CardHead({
  title,
  meta,
  action,
}: {
  title: string;
  meta?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {meta ? <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p> : null}
      </div>
      {action}
    </div>
  );
}

function Dashboard() {
  return (
    <AppShell
      title="Corpus Dashboard"
      subtitle="Consolidated view of ingested geological, exploration and statutory records."
      breadcrumb="Dashboard"
      actions={
        <Link
          to="/upload"
          className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <UploadCloud className="size-4" />
          Upload Document
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="label-caps text-muted-foreground">{k.label}</p>
              <span className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-accent/15">
                <k.icon className="size-3.5 text-primary" />
              </span>
            </div>
            <p className="mt-3 font-mono text-4xl font-bold tracking-tight text-foreground">
              {k.value}
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">{k.sub}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <CardHead
          title="CIL Coal Production (MT)"
          meta="Annual production in million tonnes · FY 22-23 to 24-25"
        />
        <div className="h-72 px-3 py-5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={coalProduction} margin={{ top: 8, right: 16, bottom: 0, left: -8 }}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="year"
                stroke="var(--color-muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[600, 800]}
                stroke="var(--color-muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "var(--color-secondary)" }}
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 6,
                  fontSize: 12,
                }}
                formatter={(v: number) => [`${v} MT`, "Production"]}
              />
              <Bar
                dataKey="mt"
                fill="var(--color-primary)"
                radius={[3, 3, 0, 0]}
                barSize={72}
                label={{
                  position: "top",
                  fill: "var(--color-foreground)",
                  fontSize: 12,
                  fontWeight: 600,
                  formatter: (v: number) => v.toFixed(1),
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="mt-4">
        <CardHead
          title="Recent Activity"
          meta="Latest extractions, answers and validation events"
          action={
            <Link
              to="/insights"
              className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-primary"
            >
              View all <ArrowUpRight className="size-3.5" />
            </Link>
          }
        />
        <ul>
          {activity.map((a) => (
            <li
              key={a.title + a.detail}
              className="flex items-start gap-3 border-b border-border px-5 py-4 last:border-0"
            >
              <span
                className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-sm ${activityTone[a.tone]}`}
              >
                <a.icon className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  <p className="text-[0.6875rem] text-muted-foreground">{a.time}</p>
                </div>
                <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                  {a.detail}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{a.meta}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </AppShell>
  );
}
