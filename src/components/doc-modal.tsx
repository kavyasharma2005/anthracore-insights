import { FileText, X } from "lucide-react";

import type { SampleDoc } from "@/lib/sample-docs";

interface DocModalProps {
  doc: SampleDoc;
  citation?: string;
  note?: string;
  onClose: () => void;
}

export function DocModal({ doc, citation, note, onClose }: DocModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy/80 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-md border border-border bg-card shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-3.5">
          <div className="flex items-start gap-2">
            <FileText className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="font-mono text-xs text-foreground">{doc.file}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{doc.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close document preview"
            className="rounded-sm p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="relative overflow-hidden rounded-sm border border-border bg-background">
            <img
              src={doc.url}
              alt={doc.title}
              className="block w-full"
              loading="lazy"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute rounded-[2px] border-l-2 border-warning bg-warning/25 ring-1 ring-warning/60"
              style={{
                top: `${doc.highlight.top}%`,
                left: `${doc.highlight.left}%`,
                width: `${doc.highlight.width}%`,
                height: `${doc.highlight.height}%`,
              }}
            />
          </div>

          <div className="mt-3 space-y-1">
            <p className="label-caps text-muted-foreground">{doc.ref}</p>
            {citation ? (
              <p className="text-xs text-foreground">
                Cited as: <span className="font-medium">{citation}</span>
              </p>
            ) : null}
            <p className="text-xs leading-relaxed text-muted-foreground">
              {note ?? "The amber band marks the passage AnthraCore grounded this answer in."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
