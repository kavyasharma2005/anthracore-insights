import doc1 from "@/assets/sample_doc_1_production_report.jpg.asset.json";
import doc2 from "@/assets/sample_doc_2_spreadsheet.jpg.asset.json";
import doc3 from "@/assets/sample_doc_3_historical_archive.jpg.asset.json";

export interface Highlight {
  /** percentages of the image box */
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface SampleDoc {
  key: "production" | "spreadsheet" | "archive";
  file: string;
  title: string;
  ref: string;
  url: string;
  highlight: Highlight;
}

export const SAMPLE_DOCS: Record<SampleDoc["key"], SampleDoc> = {
  production: {
    key: "production",
    file: "CMPDI_Geological_Production_Status_Report.pdf",
    title: "Geological & Production Status Report — Gevra OC Project (SECL)",
    ref: "Ref No: CMPDI/GEO/2024-25/0417 · 14-MAR-2025",
    url: doc1.url,
    highlight: { top: 50.2, left: 6.5, width: 86, height: 3.2 },
  },
  spreadsheet: {
    key: "spreadsheet",
    file: "production_master_FY24-25.xlsx",
    title: "Production Master Sheet — subsidiary-wise production & reserves",
    ref: "Sheet: FY24-25 · GSI Bhukosh cross-reference, Q3 FY24-25",
    url: doc2.url,
    highlight: { top: 21.4, left: 3, width: 83, height: 2.5 },
  },
  archive: {
    key: "archive",
    file: "GSI_TC_1998-99_EX-07.pdf",
    title: "Geological Survey of India — Regional Exploration Report, Talcher Coalfield",
    ref: "Report No: GSI/TC/1998-99/EX-07 · Archive Box GSI-EX-1998-014",
    url: doc3.url,
    highlight: { top: 36.6, left: 8, width: 58, height: 4.6 },
  },
};

/** Resolve a free-text citation label to the closest sample document. */
export function resolveDoc(label: string): SampleDoc {
  const l = label.toLowerCase();
  if (l.includes("gsi") || l.includes("talcher") || l.includes("1998") || l.includes("inventory"))
    return SAMPLE_DOCS.archive;
  if (l.includes("xlsx") || l.includes("master") || l.includes("spreadsheet") || l.includes("directory"))
    return SAMPLE_DOCS.spreadsheet;
  return SAMPLE_DOCS.production;
}
