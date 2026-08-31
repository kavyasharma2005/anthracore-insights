import { createFileRoute } from "@tanstack/react-router";
import { Landmark, FileText, FileDown, CheckCircle2, Loader2, Quote } from "lucide-react";
import { useRef, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { DocModal } from "@/components/doc-modal";
import { resolveDoc, type SampleDoc } from "@/lib/sample-docs";

export const Route = createFileRoute("/parliamentary-reports")({
  head: () => ({
    meta: [
      { title: "Parliamentary Reports — AnthraCore" },
      {
        name: "description",
        content:
          "Draft and verify Lok Sabha and Rajya Sabha replies on coal reserves using grounded corpus evidence.",
      },
      { property: "og:title", content: "Parliamentary Reports — AnthraCore" },
      {
        property: "og:description",
        content: "Draft and verify parliamentary replies with grounded corpus evidence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ParliamentaryReports,
});

interface DataRow {
  metric: string;
  fy2223: string;
  fy2324: string;
  fy2425: string;
}

interface Draft {
  ref: string;
  house: string;
  ministry: string;
  question: string;
  askedBy: string;
  answer: string[];
  table: DataRow[];
  citations: { label: string; detail: string }[];
  meta: string;
}

const DRAFTS: Record<string, Draft> = {
  trend: {
    ref: "LS US(Q) No. 3418",
    house: "Lok Sabha · Unstarred Question",
    ministry: "Ministry of Coal",
    question: "Coal production trend last 3 years",
    askedBy: "Shri A. member (Bilaspur, Chhattisgarh)",
    answer: [
      "The total coal production of Coal India Limited has shown a consistent upward trend over the last three financial years. Production increased from 703.2 Million Tonnes (MT) in FY 2022-23 to 773.8 MT in FY 2023-24, and further to 781.1 MT in FY 2024-25, reflecting an overall growth of 11.1% over the three-year period.",
      "The growth is primarily attributable to expansion of Open Cast Project capacity in the Northern Coalfields and South Eastern Coalfields subsidiaries, improved evacuation through commissioned rail infrastructure, and mechanisation of surface miners across identified OCPs.",
    ],
    table: [
      { metric: "Total CIL production (MT)", fy2223: "703.2", fy2324: "773.8", fy2425: "781.1" },
      { metric: "Offtake to power sector (MT)", fy2223: "557.0", fy2324: "612.4", fy2425: "618.9" },
      { metric: "Overburden removal (M Cum)", fy2223: "1,286", fy2324: "1,394", fy2425: "1,412" },
    ],
    citations: [
      {
        label: "CIL Annual Report FY23-24, p.12",
        detail: "Consolidated performance summary — production and offtake",
      },
      {
        label: "CIL Annual Report FY24-25, p.14",
        detail: "Subsidiary-wise production tables",
      },
      {
        label: "Coal Directory of India 2024-25, Table 2.1",
        detail: "Provisional coal statistics, Ministry of Coal",
      },
    ],
    meta: "Generated in 4.2 sec — 94% confidence",
  },
  reserves: {
    ref: "RS Star(Q) No. 122",
    house: "Rajya Sabha · Starred Question",
    ministry: "Ministry of Coal",
    question: "State-wise geological coal reserves",
    askedBy: "Smt. member (Ranchi, Jharkhand)",
    answer: [
      "As on 01.04.2025, the assessed geological reserves of coal in India stand at 391.0 Billion Tonnes, of which reserves within Coal India Ltd command areas account for approximately 141.2 Billion Tonnes. Jharkhand holds the largest share of geological reserves, followed by Odisha and Chhattisgarh.",
      "Reserve assessment is carried out jointly by the Geological Survey of India and CMPDI through regional exploration and borehole drilling programmes, with estimates revised as new exploration data is validated.",
    ],
    table: [
      { metric: "Jharkhand (BT)", fy2223: "83.2", fy2324: "83.5", fy2425: "83.9" },
      { metric: "Odisha (BT)", fy2223: "79.3", fy2324: "79.6", fy2425: "79.9" },
      { metric: "Chhattisgarh (BT)", fy2223: "57.2", fy2324: "57.4", fy2425: "57.6" },
    ],
    citations: [
      {
        label: "Inventory of Geological Resources of Coal, 2025",
        detail: "GSI / IBM national coal inventory as on 01.04.2025",
      },
      {
        label: "GR_NCL_Amlohri_2024.pdf, p.31",
        detail: "Block-level reserve estimation methodology",
      },
    ],
    meta: "Generated in 3.8 sec — 92% confidence",
  },
  offtake: {
    ref: "LS US(Q) No. 2711",
    house: "Lok Sabha · Unstarred Question",
    ministry: "Ministry of Coal",
    question: "Coal supply to thermal power plants",
    askedBy: "Shri member (Korba, Chhattisgarh)",
    answer: [
      "Coal India Limited supplied 618.9 MT of coal to the thermal power sector in FY 2024-25, an increase of 1.1% over the previous year. Pit-head stock levels at thermal power plants were maintained above the critical threshold for 94% of the year.",
      "First-mile connectivity (FMC) projects commissioned during the year added 75 MT of mechanised coal handling capacity, reducing road transportation and dispatch turnaround times.",
    ],
    table: [
      { metric: "Power sector supply (MT)", fy2223: "557.0", fy2324: "612.4", fy2425: "618.9" },
      { metric: "Avg. pit-head stock (days)", fy2223: "11", fy2324: "14", fy2425: "16" },
      { metric: "Critical stock alerts", fy2223: "31", fy2324: "18", fy2425: "9" },
    ],
    citations: [
      {
        label: "CIL Annual Report FY24-25, p.22",
        detail: "Sector-wise dispatch and offtake performance",
      },
      {
        label: "CEA Daily Coal Report compilation, H2 FY24-25",
        detail: "Central Electricity Authority plant stock monitoring",
      },
    ],
    meta: "Generated in 4.6 sec — 95% confidence",
  },
};

const DRAFT_LIST = [
  { key: "trend", label: "Coal production trend last 3 years" },
  { key: "reserves", label: "State-wise geological coal reserves" },
  { key: "offtake", label: "Coal supply to thermal power plants" },
];

function ParliamentaryReports() {
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [sent, setSent] = useState(false);
  const [modalDoc, setModalDoc] = useState<{ doc: SampleDoc; citation: string } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  function onSelect(value: string) {
    setSelected(value);
    if (!value) return;
    setLoading(true);
    setDraft(null);
    setSent(false);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setDraft(DRAFTS[value]!);
      setLoading(false);
    }, 2200);
  }

  return (
    <AppShell
      title="Parliamentary Reports"
      subtitle="Assisted drafting of Lok Sabha / Rajya Sabha replies with source attribution."
      breadcrumb="Parliamentary Reports"
      actions={
        <select
          value={selected}
          onChange={(e) => onSelect(e.target.value)}
          className="rounded-sm border border-border bg-card px-3 py-2 text-sm text-foreground outline-none"
        >
          <option value="">Select a preset question…</option>
          {DRAFT_LIST.map((d) => (
            <option key={d.key} value={d.key}>
              {d.label}
            </option>
          ))}
        </select>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center rounded-md border border-border bg-card p-12 shadow-[var(--shadow-card)]">
          <Loader2 className="size-5 animate-spin text-primary" />
          <p className="ml-3 text-sm text-muted-foreground">
            Retrieving corpus evidence · drafting reply…
          </p>
        </div>
      ) : draft ? (
        <div className="rounded-md border border-border bg-card shadow-[var(--shadow-card)]">
          {/* Document header */}
          <div className="border-b border-border bg-background px-8 py-6 text-center">
            <p className="label-caps text-muted-foreground">{draft.ministry}</p>
            <p className="mt-1 font-mono text-xs text-foreground">
              {draft.ref} · {draft.house}
            </p>
          </div>

          <div className="px-8 py-6">
            {/* Question */}
            <div>
              <p className="label-caps text-primary">Question</p>
              <p className="mt-1.5 text-base font-semibold text-foreground">{draft.question}</p>
              <p className="mt-1 text-xs italic text-muted-foreground">
                Asked by {draft.askedBy}
              </p>
            </div>

            {/* Answer */}
            <div className="mt-6">
              <p className="label-caps text-primary">Answer</p>
              <div className="mt-2 space-y-3 text-sm leading-relaxed text-foreground">
                {draft.answer.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Supporting data */}
            <div className="mt-6">
              <p className="label-caps text-primary">Supporting Data</p>
              <div className="mt-2 overflow-x-auto rounded-sm border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-background text-left">
                      <th className="label-caps px-4 py-2.5 text-muted-foreground">Metric</th>
                      <th className="label-caps px-4 py-2.5 text-muted-foreground">FY 22-23</th>
                      <th className="label-caps px-4 py-2.5 text-muted-foreground">FY 23-24</th>
                      <th className="label-caps px-4 py-2.5 text-muted-foreground">FY 24-25</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draft.table.map((row) => (
                      <tr key={row.metric} className="border-b border-border last:border-0">
                        <td className="px-4 py-2.5 text-xs text-foreground">{row.metric}</td>
                        <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                          {row.fy2223}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                          {row.fy2324}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs font-semibold text-foreground">
                          {row.fy2425}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Citations */}
            <div className="mt-6">
              <p className="label-caps text-primary">Source Citations</p>
              <ul className="mt-2 space-y-2">
                {draft.citations.map((c) => (
                  <li key={c.label} className="flex items-start gap-2 text-sm">
                    <Quote className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    <div>
                      <button
                        type="button"
                        onClick={() => setModalDoc({ doc: resolveDoc(c.label), citation: c.label })}
                        className="inline-flex max-w-full items-center gap-1 rounded-full border border-primary/40 bg-accent/30 px-2 py-0.5 text-left text-xs font-medium text-primary transition-colors hover:bg-accent"
                      >
                        <FileText className="size-3 shrink-0" />
                        {c.label}
                      </button>
                      <p className="text-xs text-muted-foreground">{c.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer meta + actions */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                <CheckCircle2 className="size-3.5" />
                {draft.meta}
              </span>
              <div className="flex gap-2">
                <button className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                  <FileDown className="size-4" />
                  Export as Word
                </button>
                <button
                  onClick={() => setSent(true)}
                  disabled={sent}
                  className="inline-flex items-center gap-1.5 rounded-sm bg-success px-3 py-2 text-sm font-semibold text-success-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  <CheckCircle2 className="size-4" />
                  {sent ? "Sent to Ministry" : "Approve & Send"}
                </button>
              </div>
            </div>
            {sent ? (
              <p className="mt-3 text-xs text-success">
                Draft forwarded to the Ministry of Coal drafting desk for final clearance.
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border bg-card p-12 text-center shadow-[var(--shadow-card)]">
          <Landmark className="size-8 text-primary" />
          <p className="mt-3 text-sm font-medium text-foreground">
            Select a parliamentary question to draft a reply
          </p>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
            AnthraCore searches the indexed corpus, compiles supporting data tables and attaches
            page-level citations before a geologist approves the draft.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="size-3.5" />
            1,420 parliamentary Q&A records indexed
          </div>
        </div>
      )}
      {modalDoc ? (
        <DocModal
          doc={modalDoc.doc}
          citation={modalDoc.citation}
          onClose={() => setModalDoc(null)}
        />
      ) : null}
    </AppShell>
  );
}
