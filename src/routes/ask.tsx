import { createFileRoute } from "@tanstack/react-router";
import { MessagesSquare, Sparkles, FileText, Loader2, SendHorizonal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { DocModal } from "@/components/doc-modal";
import { SAMPLE_DOCS } from "@/lib/sample-docs";

export const Route = createFileRoute("/ask")({
  head: () => ({
    meta: [
      { title: "Ask AnthraCore — Grounded Q&A on Coal Reports" },
      {
        name: "description",
        content:
          "Ask natural-language questions about CMPDI geological reports and receive citation-grounded answers.",
      },
      { property: "og:title", content: "Ask AnthraCore" },
      {
        property: "og:description",
        content: "Citation-grounded answers across the CMPDI document corpus.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AskPage,
});

interface Citation {
  label: string;
  doc: string;
  page: string;
  highlight: string;
  context: string;
}

interface Answer {
  question: string;
  segments: Array<string | { citation: number }>;
  citations: Citation[];
}

const PRESETS: { chip: string; answer: Answer }[] = [
  {
    chip: "What is the reserve estimate for Talcher Coalfield?",
    answer: {
      question: "What is the reserve estimate for Talcher Coalfield?",
      segments: [
        "Approximately 705 million tonnes (indicated + inferred), based on 1997-98 exploratory drilling across BH-101 to BH-149.",
        { citation: 0 },
      ],
      citations: [
        {
          label: "GSI Report GSI/TC/1998-99/EX-07",
          doc: SAMPLE_DOCS.archive.file,
          page: "Cover sheet · Summary of Findings",
          highlight:
            "Reserve estimate (indicated + inferred) placed at approximately 705 million tonnes, subject to revision upon further exploration density improvement.",
          context:
            "Exploratory drilling across the block confirms lateral continuity of Seam-IV over an estimated strike length of 6.2 km, with average thickness of 4.8m.",
        },
      ],
    },
  },
  {
    chip: "What was the production trend in 2023-24?",
    answer: {
      question: "What was the production trend in 2023-24?",
      segments: [
        "Coal production rose from 703.2 MT (FY22-23) to 773.8 MT (FY23-24), a 10% increase.",
        { citation: 0 },
      ],
      citations: [
        {
          label: "CMPDI Production Report, p.1",
          doc: SAMPLE_DOCS.production.file,
          page: "Page 12 · Consolidated Performance Summary",
          highlight:
            "Total coal production increased from 703.2 MT in FY 2022-23 to 773.8 MT in FY 2023-24, registering a growth of 10.0% over the previous year.",
          context:
            "…driven by expanded OCP capacity at NCL and SECL, along with improved evacuation through the Tori–Shivpur rail corridor. The subsidiary-wise breakup is presented in Annexure II…",
        },
      ],
    },
  },
  {
    chip: "What are the reserves at Amlohri OCP?",
    answer: {
      question: "What are the reserves at Amlohri OCP?",
      segments: [
        "Gross geological reserves at Amlohri OCP are stated as 412.6 MT, with 224.1 MT extractable reserves as per the 2024 Geological Report. Note: this figure conflicts with the 2019 GR value of 398.2 MT and is flagged for geologist review.",
        { citation: 0 },
      ],
      citations: [
        {
          label: "CMPDI Production Report, p.1",
          doc: SAMPLE_DOCS.production.file,
          page: "Page 31 · Section 5.3 Reserve Estimation",
          highlight:
            "The gross geological reserve of the Amlohri block is estimated at 412.6 MT as on 01.04.2024, of which 224.1 MT is considered extractable under the current mine plan.",
          context:
            "Reserve estimation follows the borehole interpolation method described in Section 4.2, using a 0.5 m minimum seam thickness cutoff. Comparison with prior GR records is provided in Annexure IV…",
        },
      ],
    },
  },
  {
    chip: "Which subsidiary had the highest production in FY24-25?",
    answer: {
      question: "Which subsidiary had the highest production in FY24-25?",
      segments: [
        "Mahanadi Coalfields Ltd (MCL) recorded the highest production in FY24-25 at 221.1 MT, ahead of South Eastern Coalfields Ltd (SECL) at 208.4 MT.",
        { citation: 0 },
      ],
      citations: [
        {
          label: "Production Master Sheet, FY24-25",
          doc: SAMPLE_DOCS.spreadsheet.file,
          page: "Page 14 · Subsidiary-wise Production",
          highlight:
            "Mahanadi Coalfields Limited led subsidiary production with 221.1 MT, followed by South Eastern Coalfields Limited at 208.4 MT and Central Coalfields Limited at 105.2 MT.",
          context:
            "…the remaining share was contributed by BCCL, WCL, ECL and NCL. Company-wide offtake matched production growth, with pit-head stocks drawn down across Q4…",
        },
      ],
    },
  },
];

function AskPage() {
  const [messages, setMessages] = useState<Answer[]>([]);
  const [thinking, setThinking] = useState<string | null>(null);
  const [modalCitation, setModalCitation] = useState<{ answer: Answer; citation: Citation } | null>(
    null,
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => window.clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  function ask(preset: (typeof PRESETS)[number]) {
    if (thinking) return;
    setThinking(preset.chip);
    timer.current = window.setTimeout(() => {
      setMessages((m) => [...m, preset.answer]);
      setThinking(null);
    }, 2000);
  }

  return (
    <AppShell
      title="Ask AnthraCore"
      subtitle="Natural-language retrieval over the indexed corpus, with page-level citations."
      breadcrumb="Ask AnthraCore"
 >
      <div className="grid gap-4 lg:grid-cols-4">
        <div className="flex flex-col rounded-md border border-border bg-card shadow-[var(--shadow-card)] lg:col-span-3">
          {/* Transcript */}
          <div ref={scrollRef} className="max-h-[28rem] flex-1 space-y-4 overflow-y-auto p-5">
            {messages.length === 0 && !thinking ? (
              <div className="flex h-56 flex-col items-center justify-center text-center">
                <span className="flex size-10 items-center justify-center rounded-sm bg-accent/15">
                  <MessagesSquare className="size-5 text-primary" />
                </span>
                <p className="mt-3 text-sm font-medium text-foreground">
                  Ask a question about the corpus
                </p>
                <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
                  Every answer is grounded in indexed documents and cited at page level.
                </p>
              </div>
            ) : null}

            {messages.map((m) => (
              <div key={m.question} className="space-y-3">
                <div className="flex justify-end">
                  <p className="max-w-[80%] rounded-md rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground">
                    {m.question}
                  </p>
                </div>
                <div className="flex gap-2.5">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-sm bg-accent/15">
                    <Sparkles className="size-3.5 text-primary" />
                  </span>
                  <div className="max-w-[85%] rounded-md rounded-bl-sm border border-border bg-background px-3.5 py-2.5 text-sm leading-relaxed text-foreground">
                    {m.segments.map((seg, i) =>
                      typeof seg === "string" ? (
                        <span key={i}>{seg} </span>
                      ) : (
                   <button
                          key={i}
                           onClick={() => setModalCitation({ answer: m, citation: m.citations[seg.citation] })}
                          className="mx-0.5 inline-flex items-center gap-1 rounded-full border border-primary/40 bg-accent/40 px-2 py-0.5 align-baseline text-xs font-medium text-primary transition-colors hover:bg-accent"
                        >
                          <FileText className="size-3" />
                          [Source: {m.citations[seg.citation]!.label}]
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </div>
            ))}

            {thinking ? (
              <div className="flex gap-2.5">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-sm bg-accent/15">
                  <Sparkles className="size-3.5 text-primary" />
                </span>
                <div className="flex items-center gap-2.5 rounded-md rounded-bl-sm border border-border bg-background px-3.5 py-2.5">
                  <Loader2 className="size-4 animate-spin text-primary" />
                  <p className="text-xs text-muted-foreground">
                    Searching corpus · grounding answer…
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Composer */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2 rounded-sm border border-border bg-background px-3 py-2">
              <input
                readOnly
                placeholder="Try a preset question below…"
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <SendHorizonal className="size-4 text-muted-foreground/50" />
            </div>
          </div>
        </div>

        {/* Preset chips */}
        <div className="rounded-md border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="text-sm font-semibold text-foreground">Suggested Questions</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Canned demo answers</p>
          </div>
          <div className="space-y-2 p-4">
            {PRESETS.map((p) => (
              <button
                key={p.chip}
                onClick={() => ask(p)}
                disabled={!!thinking}
                className="w-full rounded-sm border border-border px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:border-primary/50 hover:bg-accent/20 disabled:opacity-60"
              >
                {p.chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Citation modal */}
      {modalCitation ? (
        <DocModal
          doc={modalCitation.citation.doc.includes("GSI") ? SAMPLE_DOCS.archive : modalCitation.citation.doc.includes("Master") ? SAMPLE_DOCS.spreadsheet : SAMPLE_DOCS.production}
          citation={modalCitation.citation.label}
          note={`${modalCitation.citation.context} ${modalCitation.citation.highlight}`}
          onClose={() => setModalCitation(null)}
        />
      ) : null}
    </AppShell>
  );
}
