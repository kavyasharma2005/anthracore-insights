import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  Circle,
  FileText,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { DocModal } from "@/components/doc-modal";
import { SAMPLE_DOCS, type SampleDoc } from "@/lib/sample-docs";

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

const PRESET_DOCS: Array<{ doc: SampleDoc; label: string; type: string; summary: string }> = [
  {
    doc: SAMPLE_DOCS.production,
    label: "CMPDI Production Report",
    type: "PDF",
    summary: "Gevra OC Project · monthly production table",
  },
  {
    doc: SAMPLE_DOCS.spreadsheet,
    label: "Production Master Sheet",
    type: "XLSX",
    summary: "FY24-25 · subsidiary production and reserves",
  },
  {
    doc: SAMPLE_DOCS.archive,
    label: "GSI 1998 Archive Scan",
    type: "PDF",
    summary: "Talcher Coalfield · regional exploration report",
  },
];

const PRODUCTION_ROWS = [
  ["Apr-24", "4.82", "G8", "6.10", "1.27"],
  ["May-24", "5.01", "G8", "6.44", "1.29"],
  ["Jun-24", "3.95", "G9", "5.02", "1.27"],
  ["Jul-24", "3.41", "G9", "4.61", "1.35"],
  ["Aug-24", "3.88", "G8", "5.10", "1.31"],
  ["Sep-24", "4.15", "G8", "5.44", "1.31"],
  ["Oct-24", "5.22", "G8", "6.70", "1.28"],
  ["Nov-24", "5.60", "G7", "7.20", "1.29"],
  ["Dec-24", "5.74", "G7", "7.35", "1.28"],
  ["Jan-25", "5.88", "G7", "7.55", "1.28"],
  ["Feb-25", "5.10", "G8", "6.55", "1.28"],
] as const;

const MASTER_ROWS = [
  ["ECL", "Rajmahal OC", "3.42", "G11", "412.5", "Active"],
  ["BCCL", "Kusunda", "1.15", "G6", "88.2", "Active"],
  ["CCL", "Ashoka OCP", "6.78", "G9", "560.0", "Active"],
  ["SECL", "Gevra OC", "5.10", "G8", "1240.0", "Active"],
  ["MCL", "Bharatpur OCP", "7.90", "G10", "980.4", "Active"],
  ["NCL", "Jayant Project", "4.55", "G8", "705.3", "Active"],
  ["WCL", "Umrer Colliery", "0.82", "G12", "64.1", "Under Review"],
  ["SECL", "Kusmunda OC", "19.2", "G9", "1875.6", "Active"],
] as const;

function UploadPage() {
  const [selected, setSelected] = useState<SampleDoc | null>(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [step, setStep] = useState(0);
  const [modalDoc, setModalDoc] = useState<SampleDoc | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  function startPipeline(doc: SampleDoc) {
    if (running) return;
    timers.current.forEach(clearTimeout);
    setSelected(doc);
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
        <div className="space-y-4 lg:col-span-3">
          <div className="rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <p className="label-caps text-primary">Demo document set</p>
                <h2 className="mt-1 text-base font-semibold text-foreground">Choose a source to process</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Select a supplied sample to run the extraction pipeline against its real layout.
                </p>
              </div>
              {running ? <Loader2 className="size-5 animate-spin text-primary" /> : null}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {PRESET_DOCS.map(({ doc, label, type, summary }) => (
                <button
                  key={doc.key}
                  type="button"
                  disabled={running}
                  onClick={() => startPipeline(doc)}
                  className={`group overflow-hidden rounded-sm border text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                    selected?.key === doc.key
                      ? "border-primary bg-accent/20"
                      : "border-border hover:border-primary/60 hover:bg-accent/10"
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-secondary">
                    <img src={doc.url} alt={`${label} thumbnail`} className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]" loading="lazy" />
                    <span className="absolute right-2 top-2 rounded-sm bg-card/90 px-1.5 py-0.5 font-mono text-[0.625rem] font-semibold text-foreground">{type}</span>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold leading-snug text-foreground">{label}</p>
                    <p className="mt-1.5 text-[0.6875rem] leading-relaxed text-muted-foreground">{summary}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[0.6875rem] font-semibold text-primary">
                      {selected?.key === doc.key ? "Selected" : "Run extraction"}
                      <ArrowUpRight className="size-3" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {(running || done) && (
            <div className="rounded-md border border-border bg-card shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  <p className="font-mono text-xs text-foreground">
                    {selected?.file}
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
          {done && selected ? (
            <div className="rounded-md border border-border bg-card shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
                <div>
                     <h2 className="text-sm font-semibold text-foreground">Extraction Results</h2>
                     <p className="mt-0.5 text-xs text-muted-foreground">
                       {selected.key === "production" ? "11 monthly rows extracted · 1 needs review" : selected.key === "spreadsheet" ? "8 subsidiary rows extracted · 1 needs review" : "4 archive fields extracted · source linked"}
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
               {selected.key === "production" ? (
                 <div className="overflow-x-auto">
                   <table className="w-full min-w-[560px] text-sm">
                     <thead><tr className="border-b border-border text-left">{["Month", "Production (MT)", "Grade", "OB Removal (Mcum)", "Stripping Ratio"].map((h) => <th key={h} className="label-caps px-4 py-2.5 text-muted-foreground">{h}</th>)}</tr></thead>
                     <tbody>{PRODUCTION_ROWS.map((row) => { const review = row[0] === "Feb-25"; return <tr key={row[0]} className={`border-b border-border last:border-0 ${review ? "bg-warning/10" : ""}`}>
                       {row.map((cell, i) => <td key={i} className={`px-4 py-2.5 font-mono text-xs ${review && (i === 1 || i === 3) ? "font-semibold text-warning" : "text-foreground"}`}>{review && (i === 1 || i === 3) ? `${cell} *` : cell}</td>)}
                       </tr>; })}</tbody>
                   </table>
                 </div>
               ) : selected.key === "spreadsheet" ? (
                 <div className="overflow-x-auto">
                   <table className="w-full min-w-[620px] text-sm">
                     <thead><tr className="border-b border-border text-left">{["Subsidiary", "Mine Name", "Production (MT)", "Grade", "Reserves (MT)", "Status"].map((h) => <th key={h} className="label-caps px-4 py-2.5 text-muted-foreground">{h}</th>)}</tr></thead>
                     <tbody>{MASTER_ROWS.map((row) => { const review = row[0] === "WCL"; return <tr key={row[1]} className={`border-b border-border last:border-0 ${review ? "bg-warning/10" : ""}`}>
                       {row.map((cell, i) => <td key={i} className={`px-4 py-2.5 text-xs ${review ? "text-warning" : "text-foreground"} ${i === 2 || i === 4 ? "font-mono" : ""}`}>{cell}</td>)}
                       </tr>; })}</tbody>
                   </table>
                 </div>
               ) : (
                 <div className="grid gap-3 p-5 sm:grid-cols-2">
                   {["Regional Exploration Report", "Survey Period", "Borehole Series", "Reserve Estimate"].map((field, i) => <div key={field} className="border-b border-border pb-3 last:border-0 sm:last:border-b-0">
                     <p className="label-caps text-muted-foreground">{field}</p>
                     <p className="mt-1 text-sm font-medium text-foreground">{["Talcher Coalfield", "Nov 1997 – Mar 1998", "BH-101 to BH-149", "Approximately 705 MT"][i]}</p>
                   </div>)}
                 </div>
               )}
              <div className="border-t border-border px-5 py-3.5">
                 <div className="flex flex-wrap items-center justify-between gap-3">
                   <p className="text-xs leading-relaxed text-muted-foreground">{selected.key === "archive" ? "Archive fields were extracted from the scanned cover sheet." : "Amber rows are routed to geologist review before being written to the validated corpus."}</p>
                   <button type="button" onClick={() => setModalDoc(selected)} className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-accent/30 px-2.5 py-1 text-[0.6875rem] font-medium text-primary transition-colors hover:bg-accent"><FileText className="size-3" />[Source: {selected.ref.split(" · ")[0]}]</button>
                 </div>
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
      {modalDoc ? <DocModal doc={modalDoc} citation={modalDoc.ref} onClose={() => setModalDoc(null)} /> : null}
    </AppShell>
  );
}
