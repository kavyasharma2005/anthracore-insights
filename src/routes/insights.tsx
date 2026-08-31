import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, TrendingUp } from "lucide-react";

import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights — AnthraCore Corpus Analytics" },
      {
        name: "description",
        content:
          "Topic frequency and trend analysis across the indexed coalfield document corpus.",
      },
      { property: "og:title", content: "Insights — AnthraCore" },
      {
        property: "og:description",
        content:
          "Topic frequency and trend analysis across the indexed coalfield document corpus.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InsightsPage,
});

// Word cloud: weight drives font size and tone (amber = dominant, blue = mid, white = low)
const cloudWords: { text: string; weight: number; tone: "amber" | "blue" | "white" }[] = [
  { text: "production", weight: 96, tone: "amber" },
  { text: "reserve", weight: 82, tone: "blue" },
  { text: "mine", weight: 78, tone: "blue" },
  { text: "grade", weight: 71, tone: "blue" },
  { text: "compliance", weight: 64, tone: "amber" },
  { text: "OCR", weight: 58, tone: "white" },
  { text: "extraction", weight: 52, tone: "blue" },
  { text: "borehole", weight: 47, tone: "white" },
  { text: "clearance", weight: 43, tone: "blue" },
  { text: "seam", weight: 39, tone: "white" },
  { text: "DPR", weight: 35, tone: "blue" },
  { text: "exploration", weight: 31, tone: "white" },
  { text: "dispatch", weight: 27, tone: "blue" },
  { text: "geology", weight: 24, tone: "white" },
  { text: "offtake", weight: 21, tone: "white" },
  { text: "coalfield", weight: 18, tone: "white" },
];

const toneClass = {
  amber: "text-primary",
  blue: "text-chart-2",
  white: "text-foreground",
} as const;

const topTopics = [
  { topic: "Production & offtake trends", pct: 24.1, delta: "+3.2% vs last quarter" },
  { topic: "Reserve estimation updates", pct: 18.6, delta: "+1.8% vs last quarter" },
  { topic: "Grade & seam analysis", pct: 15.4, delta: "+0.6% vs last quarter" },
  { topic: "Environmental clearance", pct: 12.2, delta: "-0.9% vs last quarter" },
  { topic: "Mine plan compliance", pct: 9.8, delta: "+0.4% vs last quarter" },
  { topic: "Extraction & OCR quality", pct: 7.3, delta: "+2.1% vs last quarter" },
];

function InsightsPage() {
  return (
    <AppShell
      title="Insights"
      subtitle="Aggregate trends derived from the indexed geological and statutory record set."
      breadcrumb="Insights"
 >
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Word cloud */}
        <div className="rounded-md border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="text-sm font-semibold text-foreground">Corpus Word Cloud</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Term frequency across 12,480 indexed documents · this quarter
            </p>
          </div>
          <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-2 px-6 py-10">
            {cloudWords.map((w) => {
              const size = 12 + Math.round((w.weight / 100) * 28); // 12px – 40px
              return (
                <span
                  key={w.text}
                  className={`font-semibold leading-tight ${toneClass[w.tone]}`}
                  style={{ fontSize: `${size}px`, opacity: 0.45 + (w.weight / 100) * 0.55 }}
                  title={`${w.weight}% relative frequency`}
                >
                  {w.text}
                </span>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-4 border-t border-border px-5 py-3 text-[0.6875rem] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-primary" /> Dominant
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-chart-2" /> Elevated
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-muted-foreground" /> Baseline
            </span>
          </div>
        </div>

        {/* Top topics */}
        <div className="rounded-md border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="text-sm font-semibold text-foreground">Top Topics This Quarter</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Share of indexed volume · Apr–Jun 2026
            </p>
          </div>
          <ul className="px-5 py-4">
            {topTopics.map((t) => (
              <li
                key={t.topic}
                className="border-b border-border py-3.5 first:pt-0 last:border-0 last:pb-0"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">{t.topic}</p>
                  <p className="font-mono text-sm font-semibold text-foreground">{t.pct}%</p>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(t.pct / 24.1) * 100}%` }}
                    />
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-[0.6875rem] text-muted-foreground">
                    <TrendingUp
                      className={`size-3 ${t.delta.startsWith("-") ? "rotate-180 text-destructive" : "text-success"}`}
                    />
                    {t.delta}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3.5 shadow-[var(--shadow-card)]">
        <BarChart3 className="size-4 text-primary" />
        <p className="text-xs text-muted-foreground">
          Topic shares are simulated for this demo build and will reflect live corpus analytics
          once ingestion pipelines are connected.
        </p>
      </div>
    </AppShell>
  );
}
