import { createFileRoute } from "@tanstack/react-router";
import {
  UploadCloud,
  CheckCircle2,
  Loader2,
  Circle,
  FileText,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload & Process — AnthraCore" },
      {
        name: "description",
        content:
          "Ingest geological reports, borehole logs and mine plans into the AnthraCore extraction pipeline.",
      },
      { property: "og:title", content: "Upload & Process — AnthraCore" },
      {
        property: "og:description",
        content:
          "Ingest geological reports, borehole logs and mine plans into the AnthraCore extraction pipeline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UploadPage,
});

const PIPELINE_STEPS = [
  "Uploading document...",
  "Running OCR (Tesseract)...",
  "Extracting structured data...",
  "Cross-validating vs historical trend...",
  "Confidence scoring...",
];

interface ExtractedField {
  field: string;
  value: string;
  source: string;
  confidence: number;
}

const EXTRACTED_FIELDS: ExtractedField[] = [
  {
    field: "Mine Name",
    value: "Amlohri Open Cast Project",
    source: "p. 12 · Table 3.2",
    confidence: 97,
  },
  {
    field: "Production MT",
    value: "14.20 MT (2025-26 target)",
    source: "p. 47 · Para 4.1.2",
    confidence: 93,
  },
  {
    field: "Period",
    value: "April 2025 – March 2026",
    source: "p. 8 · Cover sheet",
    confidence: 89,
  },
  {
    field: "Grade",
    value: "Grade C / UG-III — needs historical check",
    source: "p. 51 · Annexure VII (blurry scan)",
    confidence: 62,
  },
];

function UploadPage() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [step, setStep] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  function startPipeline() {
    timers.current.forEach(clearTimeout);
    setRunning(true);
    setDone(false);
    setStep(0);

    PIPELINE_STEPS.forEach((_, i) => {
      // mark step i complete and begin step i+1 after 1.5s
      timers.current.push(
        window.setTimeout(() => {
          if (i === PIPELINE_STEPS.length - 1) {
            setRunning(false);
            setDone(true);
          } else {
            setStep(i + 1);
          }
        }, 1500 * (i + 1)),
      );
    });
  }

  function reset() {
    timers.current.forEach(clearTimeout);
    setRunning(false);
    setDone(false);
    setStep(0);
  }

  const progress = Math.round(((done ? PIPELINE_STEPS.length : step) / PIPELINE_STEPS.length) * 100);

  return (
    <AppShell
      title="Upload & Process"
      subtitle="Queue scanned reports for OCR, table extraction and cross-validation."
      breadcrumb="Upload & Process"
>
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Upload / pipeline column */}
        <div className="space-y-4 lg:col-span-3">
          <div className="rounded-md border border-dashed border-border bg-card px-6 py-12 text-center shadow-[var(--shadow-card)]">
            <span className="mx-auto flex size-12 items-center justify-center rounded-sm bg-accent/15">
              <UploadCloud className="size-6 text-primary" />
            </span>
            <p className="mt-4 text-sm font-semibold text-foreground">
              Drag & drop geological reports, borehole logs or mine plans
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              PDF, TIFF or scanned images · up to 500 MB per file
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={running ? undefined : startPipeline}
                disabled={running}
                className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {running ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <UploadCloud className="size-4" />
                )}
                Upload Sample Report
              </button>
              <span className="text-xs text-muted-foreground">
                Demo preset: <span className="font-mono">GR_Amlohri_OCP_Annual_2025.pdf</span>
              </span>
            </div>
          </div>

          {(running || done) && (
            <div className="rounded-md border border-border bg-card shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  <p className="font-mono text-xs text-foreground">
                    GR_Amlohri_OCP_Annual_2025.pdf · 412 pages
                  </p>
                </div>
                <span className="font-mono text-xs font-semibold text-foreground">
                  {done ? "100%" : `${progress}%`}
                </span>
              </div>
              <div className="px-5 pt-4">
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${done ? 100 : progress}%` }}
                  />
                </div>
              </div>
              <ol className="px-5 py-4">
                {PIPELINE_STEPS.map((label, i) => {
                  const complete = done || i < step;
                  const active = !done && running && i === step;
                  return (
                    <li key={label} className="flex items-center gap-3 py-2">
                      {complete ? (
                        <CheckCircle2 className="size-4 shrink-0 text-success" />
                      ) : active ? (
                        <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
                      ) : (
                        <Circle className="size-4 shrink-0 text-muted-foreground/40" />
                      )}
                      <span
                        className={
                          complete
                            ? "text-sm text-muted-foreground"
                            : active
                              ? "text-sm font-medium text-foreground"
                              : "text-sm text-muted-foreground/60"
                        }
                      >
                        {label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>

        {/* Results column */}
        <div className="lg:col-span-2">
          {done ? (
            <div className="rounded-md border border-border bg-card shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Extraction Results</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    4 fields extracted · 1 needs review
                  </p>
                </div>
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-border px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <RotateCcw className="size-3.5" />
                  Re-run
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="label-caps px-5 py-2.5 text-muted-foreground">Field</th>
                      <th className="label-caps px-3 py-2.5 text-muted-foreground">Value</th>
                      <th className="label-caps px-5 py-2.5 text-right text-muted-foreground">
                        Confidence
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {EXTRACTED_FIELDS.map((f) => {
                      const low = f.confidence < 80;
                      return (
                        <tr
                          key={f.field}
                          className={
                            low
                              ? "border-b border-border bg-warning/5 last:border-0"
                              : "border-b border-border last:border-0"
                          }
                        >
                          <td className="px-5 py-3 align-top text-xs font-medium text-foreground">
                            {f.field}
                          </td>
                          <td className="px-3 py-3 align-top">
                            <p className="text-xs text-foreground">{f.value}</p>
                            <p className="mt-0.5 font-mono text-[0.6875rem] text-muted-foreground">
                              {f.source}
                            </p>
                          </td>
                          <td className="px-5 py-3 text-right align-top">
                            <span
                              className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[0.6875rem] font-semibold ${
                                low
                                  ? "bg-warning/15 text-warning"
                                  : "bg-success/10 text-success"
                              }`}
                            >
                              {f.confidence}%
                            </span>
                            {low ? (
                              <span className="mt-1.5 flex items-center justify-end gap-1 text-[0.6875rem] font-medium text-warning">
                                <TriangleAlert className="size-3" />
                                Needs Review
                              </span>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-border px-5 py-3.5">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Fields below 80% confidence are routed to geologist review before being written
                  to the validated corpus.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-40 items-center justify-center rounded-md border border-dashed border-border bg-card px-6 text-center shadow-[var(--shadow-card)]">
              <p className="text-sm text-muted-foreground">
                Extraction results will appear here after the pipeline completes.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
