import React from "react";
import type { Metadata } from "next";
import {
  Download,
  FileText,
  FileType2,
  Ruler,
  ListOrdered,
  Contact,
  EyeOff,
  AlignLeft,
  Tags,
  BookMarked,
  Table2,
  Paperclip,
  HeartPulse,
  ClipboardList,
  CheckSquare,
  FolderOutput,
} from "lucide-react";
import { JournalTabs } from "@/components/journal/journal-tabs";
import { JournalPageHeader } from "@/components/journal/journal-page-header";
import { PolicySection } from "@/components/journal/policy-section";

export const metadata: Metadata = {
  title: "Submission Guidelines — GRPJ",
  description:
    "Manuscript types, formatting, and submission requirements for the Gender Research and Policy Journal (GRPJ).",
  alternates: { canonical: "/journal/submission-guidelines" },
};

const TEMPLATE_URL =
  "https://pwravqzegskptmxzwjtx.supabase.co/storage/v1/object/public/file/public_downloadable/GRPJ-Template-v.2026.docx";

const manuscriptTypes = [
  { type: "Original Research Article", length: "5,000–8,000 words" },
  { type: "Review Article (Systematic or Narrative)", length: "6,000–10,000 words" },
  { type: "Policy Analysis", length: "4,000–7,000 words" },
  { type: "Policy Brief", length: "2,000–3,500 words" },
  { type: "Short Communication", length: "2,000–3,000 words" },
  { type: "Methodological Paper", length: "4,000–7,000 words" },
  { type: "Commentary or Perspective", length: "1,500–2,500 words" },
  { type: "Book Review (by invitation or approval)", length: "1,000–2,000 words" },
];

const formatSpecs = [
  ["Paper size", "A4"],
  ["Margins", "2.54 cm (1 inch) on all sides"],
  ["Font", "Times New Roman"],
  ["Font size", "12-point"],
  ["Line spacing", "Double-spaced"],
  ["Paragraph alignment", "Justified"],
  ["Page numbers", "Bottom center"],
];

const manuscriptOrder = [
  "Title Page (submitted separately)",
  "Blinded Manuscript",
  "Abstract",
  "Keywords",
  "Introduction",
  "Materials and Methods (or Methodology)",
  "Results",
  "Discussion",
  "Conclusion",
  "Acknowledgments",
  "Funding Statement",
  "Conflict of Interest Statement",
  "Data Availability Statement",
  "AI Use Declaration",
  "Author Contributions (CRediT Taxonomy)",
  "References",
  "Tables",
  "Figure Captions",
  "Figures",
  "Supplementary Materials (if applicable)",
];

const submissionFiles = [
  "Cover Letter",
  "Title Page",
  "Blinded Manuscript",
  "Tables (if separate)",
  "Figures",
  "Supplementary Materials (optional)",
  "Reporting Guideline Checklist (if applicable)",
  "Ethical Approval Document (when required)",
];

const checklist = [
  "the manuscript is original;",
  "the manuscript is not under consideration elsewhere;",
  "all authors have approved the submission;",
  "formatting requirements have been followed;",
  "references comply with APA 7th Edition;",
  "tables and figures are correctly labeled;",
  "ethical approval has been documented where required;",
  "funding and conflicts of interest have been disclosed;",
  "the Data Availability Statement has been included;",
  "the AI Use Declaration has been completed;",
  "the Author Contributions statement has been prepared; and",
  "all required files have been uploaded.",
];

export default function SubmissionGuidelinesPage() {
  return (
    <div className="pt-20">
      <JournalPageHeader
        eyebrow="For Authors"
        title="Submission Guidelines"
        description="Manuscript categories, formatting specifications, and required declarations for authors submitting to the Gender Research and Policy Journal (GRPJ)."
      />

      <JournalTabs />

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <PolicySection icon={FileText} title="Types of Manuscripts">
            <p>GRPJ accepts the following manuscript categories. Word counts include the main text but exclude references, tables, and appendices.</p>
            <div className="not-prose overflow-x-auto rounded-xl border border-border mt-4">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left font-semibold px-4 py-3">Article Type</th>
                    <th className="text-left font-semibold px-4 py-3">Recommended Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {manuscriptTypes.map((row) => (
                    <tr key={row.type}>
                      <td className="px-4 py-3 text-foreground">{row.type}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PolicySection>

          <PolicySection icon={AlignLeft} title="Language">
            <p>
              Manuscripts must be written in clear, concise, and
              grammatically correct British English. Authors whose
              first language is not English are strongly encouraged to
              obtain professional language editing before submission.
              Language quality alone does not determine acceptance; however,
              manuscripts must be sufficiently clear to permit scientific
              evaluation.
            </p>
          </PolicySection>

          <PolicySection icon={Ruler} title="Manuscript Preparation">
            <p>
              Manuscripts shall be prepared using Microsoft Word and conform
              to the following specifications. Continuous line numbering is
              encouraged to facilitate peer review.
            </p>
            <div className="not-prose overflow-x-auto rounded-xl border border-border mt-4">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-border">
                  {formatSpecs.map(([label, value]) => (
                    <tr key={label}>
                      <td className="px-4 py-3 font-medium text-foreground w-1/3">{label}</td>
                      <td className="px-4 py-3 text-muted-foreground">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="not-prose mt-6 flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-border bg-muted/30 p-5">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FileType2 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-base font-bold text-foreground">
                  GRPJ Manuscript Template
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Download the official template for preparing your GRPJ
                  submission.
                </div>
              </div>
              <a
                href={TEMPLATE_URL}
                download="GRPJ-Template-v.2026.docx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 gad-gradient text-white px-6 py-3 rounded-md text-sm font-medium shadow-md hover:opacity-90 transition-opacity shrink-0"
              >
                <Download className="h-4 w-4" />
                Download Template
              </a>
            </div>
          </PolicySection>

          <PolicySection icon={ListOrdered} title="Manuscript Organization">
            <p>Manuscripts should be arranged in the following order:</p>
            <ol>
              {manuscriptOrder.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </PolicySection>

          <PolicySection icon={Contact} title="Title Page">
            <p>The Title Page (not sent to reviewers) should include:</p>
            <ul>
              <li>manuscript title;</li>
              <li>running title (maximum 50 characters);</li>
              <li>full names of all authors;</li>
              <li>institutional affiliations;</li>
              <li>ORCID iDs (recommended for all authors and required for the corresponding author);</li>
              <li>corresponding author&apos;s name, institutional address, and email address; and</li>
              <li>acknowledgments of funding or institutional support, where applicable.</li>
            </ul>
          </PolicySection>

          <PolicySection icon={EyeOff} title="Blinded Manuscript">
            <p>
              To preserve the integrity of the double-blind peer-review
              process, the manuscript must not contain author names,
              affiliations, acknowledgments identifying individuals or
              institutions, self-identifying references, or metadata
              revealing author identity. Authors should replace identifying
              citations with neutral wording where necessary and restore
              them after acceptance.
            </p>
          </PolicySection>

          <PolicySection icon={AlignLeft} title="Abstract & Keywords">
            <p>
              The abstract should not exceed 250 words. Original research
              articles should use a structured format — Background,
              Objectives, Methods, Results, Conclusions. Review articles and
              policy papers may use an unstructured abstract, understandable
              without reference to the full article.
            </p>
            <p>
              Provide three to six keywords immediately after the abstract.
              Keywords should not duplicate words already appearing in the
              title, should use internationally recognized terminology where
              possible, and should facilitate indexing and database
              retrieval.
            </p>
          </PolicySection>

          <PolicySection icon={BookMarked} title="References">
            <p>
              GRPJ follows the APA 7th Edition referencing style. Authors
              are responsible for ensuring that every citation appears in
              the reference list, every reference cited is accurate and
              complete, DOIs are included whenever available, and references
              are current, relevant, and directly support the manuscript.
              Excessive self-citation or citation manipulation is
              prohibited.
            </p>
          </PolicySection>

          <PolicySection icon={Table2} title="Tables and Figures">
            <p>
              Tables and figures should be numbered consecutively, include
              concise titles and explanatory legends, be cited within the
              text, avoid duplication of information already presented, and
              be submitted in editable or high-resolution formats. Images
              should have a minimum resolution of 300 dpi. Acceptable file
              formats include TIFF, PNG, JPEG, EPS, and editable Microsoft
              Office formats. Authors are responsible for obtaining
              permission to reproduce copyrighted material.
            </p>
          </PolicySection>

          <PolicySection icon={Paperclip} title="Supplementary Materials">
            <p>
              Supplementary files may include questionnaires, interview
              guides, coding frameworks, datasets, multimedia files,
              additional tables, appendices, or analytical code.
              Supplementary materials should be clearly labeled and
              referenced within the manuscript.
            </p>
          </PolicySection>

          <PolicySection icon={HeartPulse} title="Ethical Requirements">
            <p>
              Research involving human participants or animals must include
              ethics committee approval, an approval reference number where
              applicable, an informed consent statement, consent for
              publication when required, and compliance with relevant
              ethical standards.
            </p>
          </PolicySection>

          <PolicySection icon={ClipboardList} title="Required Declarations">
            <p>Every submission must include the following statements:</p>
            <ul>
              <li>Funding Statement</li>
              <li>Conflict of Interest Statement</li>
              <li>Data Availability Statement</li>
              <li>AI Use Declaration</li>
              <li>Author Contributions</li>
            </ul>
          </PolicySection>

          <PolicySection icon={CheckSquare} title="Submission Checklist">
            <p>Before submission, authors should confirm that:</p>
            <ul>
              {checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </PolicySection>

          <PolicySection icon={FolderOutput} title="Submission Files">
            <p>Authors should submit the following documents separately:</p>
            <ol>
              {submissionFiles.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </PolicySection>
        </div>
      </section>
    </div>
  );
}
