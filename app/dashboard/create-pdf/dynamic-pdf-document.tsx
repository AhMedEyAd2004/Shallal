import React from "react";
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { CompanySettings, DocumentData } from "./pdf";
import { pdfStyles } from "./pdfStyles";

// All layout/typography styles now live in pdfStyles.ts (single source of
// truth for every PDF template) — see that file for the definitions.

// Arabic (and other RTL script) Unicode ranges — used to decide marker side
// and run order per-paragraph, since a document can mix LTR/RTL blocks.
const RTL_CHAR_PATTERN =
  /[\u0591-\u07FF\u08A0-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;

function isRTLText(text: string) {
  return RTL_CHAR_PATTERN.test(text);
}

const BULLET_CHARS = ["•", "◦", "▪"];

function bulletFor(indentLevel: number) {
  return BULLET_CHARS[Math.min(indentLevel, BULLET_CHARS.length - 1)];
}

const ALIGN_STYLES: Record<string, any> = {
  left: pdfStyles.alignLeft,
  center: pdfStyles.alignCenter,
  right: pdfStyles.alignRight,
  justify: pdfStyles.alignJustify,
};

interface TextRun {
  text: string;
  attributes: Record<string, any>;
}

interface ParsedParagraph {
  runs: TextRun[];
  alignStyle: any;
  alignment?: string;
  direction?: "rtl" | null;
  headerLevel?: number | null;
  listType?: "bullet" | "ordered" | null;
  indentLevel?: number;
  isBlankLine?: boolean;
}

/**
 * Converts a Quill Delta's `ops` array into a flat list of paragraph
 * objects. Block-level attributes (align, header, list, indent,
 * direction) live on the newline op that *ends* a line in Quill's
 * format, so inline runs are accumulated until a "\n" is hit, then
 * flushed as one paragraph using that newline op's attributes.
 *
 * Hoisted out of the component (and out of the per-block render loop
 * it used to live in) so it's a plain pure function instead of being
 * redefined on every render.
 */
function deltaOpsToParagraphs(ops: any[]): ParsedParagraph[] {
  const paragraphs: ParsedParagraph[] = [];
  let currentRuns: TextRun[] = [];

  for (const op of ops) {
    if (typeof op.insert !== "string" || !op.insert) continue;

    if (!op.insert.includes("\n")) {
      currentRuns.push({ text: op.insert, attributes: op.attributes || {} });
      continue;
    }

    const parts = op.insert.split("\n");
    const alignment = op.attributes?.align || "left";
    const blockMeta = {
      alignStyle: ALIGN_STYLES[alignment] || pdfStyles.alignLeft,
      alignment,
      direction: (op.attributes?.direction === "rtl" ? "rtl" : null) as
        | "rtl"
        | null,
      headerLevel: op.attributes?.header || null,
      listType: (op.attributes?.list as "bullet" | "ordered") || null,
      indentLevel: op.attributes?.indent || 0,
    };

    parts.forEach((part: any, i: number) => {
      const isLast = i === parts.length - 1;

      // Trailing fragment after the final "\n" belongs to the *next*
      // line — carry it forward instead of flushing it here.
      if (isLast) {
        if (part)
          currentRuns.push({ text: part, attributes: op.attributes || {} });
        return;
      }

      if (i === 0) {
        if (part)
          currentRuns.push({ text: part, attributes: op.attributes || {} });
        paragraphs.push({ runs: currentRuns, ...blockMeta });
        currentRuns = [];
      } else {
        // A user pressed Enter multiple times in a row inside one op —
        // each interior part is its own (usually blank) line. It still
        // inherits this op's block formatting rather than being dropped.
        paragraphs.push({
          runs: [{ text: part || " ", attributes: op.attributes || {} }],
          isBlankLine: !part,
          ...blockMeta,
        });
      }
    });
  }

  // Catch any unclosed trailing run that never hit a newline.
  if (currentRuns.length > 0) {
    paragraphs.push({ runs: currentRuns, alignStyle: pdfStyles.alignLeft });
  }

  return paragraphs;
}

/**
 * Maps a Quill text-align value to flexbox justifyContent for an RTL
 * row-reverse container.  Used instead of textAlign when we render RTL
 * paragraphs as a flex View of individual <Text> elements to sidestep
 * react-pdf's broken bidi style-assignment on nested <Text> children.
 */
const RTL_JUSTIFY: Record<string, any> = {
  right: { justifyContent: "flex-start" as const },
  left: { justifyContent: "flex-end" as const },
  center: { justifyContent: "center" as const },
};

function rtlJustify(alignment?: string): any {
  return RTL_JUSTIFY[alignment || "right"] || RTL_JUSTIFY.right;
}

/** Builds the inline style array for a single TextRun. */
function buildRunStyle(run: TextRun, baseStyle?: any): any[] {
  const s: any[] = baseStyle ? [baseStyle] : [];
  if (run.attributes?.underline) s.push(pdfStyles.underline);
  if (run.attributes?.strike) s.push(pdfStyles.strikethrough);
  if (run.attributes?.color) s.push({ color: run.attributes.color });
  if (run.attributes?.background)
    s.push({ backgroundColor: run.attributes.background });
  return s;
}

/**
 * Splits a run's text into word tokens, each keeping its trailing
 * whitespace attached (so "word " stays one wrap-unit, not two).
 *
 * The RTL paragraphs below render each run as its own flex item inside
 * a row-reverse View instead of nesting <Text> children (react-pdf's
 * bidi engine mis-colors nested runs in RTL text). But a <Text> that's
 * a flex sibling is an *atomic* block in Yoga's layout — it never
 * wraps word-by-word against its neighbors, it just jumps to the next
 * line as a whole unit once the row runs out of space. As soon as a
 * paragraph has more than one run (i.e. any inline styling is applied
 * mid-line), that run — and everything after it — gets shoved onto its
 * own line instead of flowing with the rest of the paragraph.
 *
 * Tokenizing to word-level flex items fixes this: each *word* is now
 * the atomic wrap unit, so wrapping happens naturally across runs just
 * like normal text, regardless of how many differently-styled runs
 * make up the line.
 */
function tokenizeRun(run: TextRun): TextRun[] {
  const words = run.text.split(/(?<=\s)/); // keep trailing space on each word
  return words
    .filter(Boolean)
    .map((text) => ({ text, attributes: run.attributes }));
}

/** Renders runs as word-level flex items for RTL row-reverse containers. */
function renderRTLTokens(runs: TextRun[], baseStyle?: any) {
  return runs.flatMap((run, rIdx) =>
    tokenizeRun(run).map((token, tIdx) => (
      <Text key={`${rIdx}-${tIdx}`} style={buildRunStyle(token, baseStyle)}>
        {token.text}
      </Text>
    )),
  );
}

/**
 * Renders a paragraph's runs as nested <Text> spans, in source order.
 */
function renderRuns(runs: TextRun[]) {
  return runs.map((run, rIdx) => {
    const runStyle: any[] = [];
    // Bold is intentionally never applied here. The Tajawal bold weight
    // breaks rendering for Arabic text, which is why "bold" is excluded
    // from the editor's format whitelist in document-form-panel.tsx.
    // This is a second guard so any document saved *before* that
    // whitelist existed (and still has bold:true in its stored delta
    // JSON) can't reintroduce the crash either.
    if (run.attributes?.underline) runStyle.push(pdfStyles.underline);
    if (run.attributes?.strike) runStyle.push(pdfStyles.strikethrough);
    if (run.attributes?.color) runStyle.push({ color: run.attributes.color });
    if (run.attributes?.background)
      runStyle.push({ backgroundColor: run.attributes.background });

    return (
      <Text key={rIdx} style={runStyle}>
        {run.text}
      </Text>
    );
  });
}

/** Renders one page-block's stringified Quill Delta as PDF paragraphs. */
function renderDeltaBlock(blockContent: string, blockIdx: number) {
  let deltaObj: any;
  try {
    deltaObj = JSON.parse(blockContent);
  } catch (error) {
    console.error("Failed parsing structural JSON block:", error);
    return (
      <View key={`error-${blockIdx}`} style={pdfStyles.blockWrapper}>
        <Text style={pdfStyles.alignLeft}>{blockContent}</Text>
      </View>
    );
  }

  const paragraphs = deltaOpsToParagraphs(deltaObj.ops || []);

  return (
    <View key={`block-json-${blockIdx}`} style={pdfStyles.blockWrapper}>
      {paragraphs.map((para, pIdx) => {
        // Filter out completely corrupted, uninitialized text line segments
        if (para.runs.length === 0) return null;

        // An intentional blank line (user pressed Enter twice): render as
        // a small fixed spacer rather than a full text line with its own
        // line-height + margin, which would otherwise compound into an
        // oversized gap.
        if (para.isBlankLine) {
          return <View key={pIdx} style={{ height: 6 }} />;
        }

        const paraText = para.runs.map((run) => run.text || "").join("");
        // Explicit direction (from the editor's RTL button) wins over
        // auto-detection — the user told us directly.
        const isRTLParagraph = para.direction === "rtl" || isRTLText(paraText);
        const indentPadding = (para.indentLevel || 0) * 20;

        // Bullet list items. Numbering has been removed — any list
        // (including legacy "ordered" data from older saved documents)
        // renders as a bullet marker.
        if (para.listType === "bullet" || para.listType === "ordered") {
          const marker = bulletFor(para.indentLevel || 0);

          // Marker side rule:
          //  - justify right + RTL  -> marker on the right
          //  - justify left  + LTR  -> marker on the left
          //  - anything else (center/justify align, or an align/lang
          //    mismatch) -> just follow the detected direction
          const markerOnRight =
            para.alignment === "right" && isRTLParagraph
              ? true
              : para.alignment === "left" && !isRTLParagraph
                ? false
                : isRTLParagraph;

          return (
            <View
              key={pIdx}
              style={
                [
                  pdfStyles.listItemRow,
                  markerOnRight ? pdfStyles.listItemRowRTL : undefined,
                  markerOnRight
                    ? { paddingRight: indentPadding }
                    : { paddingLeft: indentPadding },
                ] as any
              }
            >
              <Text
                style={[
                  pdfStyles.listMarker,
                  markerOnRight ? { marginLeft: 3 } : { marginRight: 3 },
                ]}
              >
                {marker}
              </Text>
              {isRTLParagraph && para.runs.length > 1 ? (
                <View
                  style={[
                    pdfStyles.rtlRunContainer,
                    { flex: 1 },
                    rtlJustify(para.alignment),
                  ]}
                >
                  {renderRTLTokens(para.runs, pdfStyles.listText)}
                </View>
              ) : (
                <Text style={[pdfStyles.listText, para.alignStyle]}>
                  {renderRuns(para.runs)}
                </Text>
              )}
            </View>
          );
        }

        // Headings
        const headingStyle =
          para.headerLevel === 1
            ? pdfStyles.heading1
            : para.headerLevel === 2
              ? pdfStyles.heading2
              : para.headerLevel === 3
                ? pdfStyles.heading3
                : null;

        return (
          <View
            key={pIdx}
            style={
              [
                pdfStyles.paragraphWrapper,
                !isRTLParagraph ? para.alignStyle : undefined,
                headingStyle ? pdfStyles.headingWrapper : undefined,
                { paddingLeft: indentPadding },
              ] as any
            }
          >
            {isRTLParagraph && para.runs.length > 1 ? (
              <View
                style={[pdfStyles.rtlRunContainer, rtlJustify(para.alignment)]}
              >
                {renderRTLTokens(para.runs, headingStyle || pdfStyles.normal)}
              </View>
            ) : (
              <Text style={[headingStyle || pdfStyles.normal, para.alignStyle]}>
                {renderRuns(para.runs)}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

interface PdfDocumentTemplateProps {
  company: CompanySettings;
  document: DocumentData;
}

export function DynamicPdfDocument({
  company,
  document,
}: PdfDocumentTemplateProps) {
  // Prefer the new multi-page block structure; fall back to the legacy
  // single `content` string so older documents still render something.
  const currentPages: string[][] =
    document?.pages && document.pages.length > 0
      ? document.pages
      : [[document?.content || ""]];

  return (
    <Document>
      {currentPages.map((blocks, pageIdx) => (
        <Page key={`page-${pageIdx}`} size="A4" style={pdfStyles.page}>
          {/* Header: only on the first page */}
          {pageIdx === 0 && (
            <View style={pdfStyles.header}>
              <View>
                <Text style={pdfStyles.title}>
                  {document?.title || "مستند"}
                </Text>
                <Text style={pdfStyles.companyNameSmall}>
                  {company?.companyName || ""}
                </Text>
              </View>
              {company?.logo && (
                <Image src={company.logo} style={pdfStyles.logo} />
              )}
            </View>
          )}

          {/* Client info: only on the first page */}
          {pageIdx === 0 &&
            (document?.client?.name ||
              document?.client?.phone ||
              document?.client?.email) && (
              <View style={pdfStyles.clientBox}>
                <Text style={pdfStyles.clientLabel}>بيانات العميل</Text>
                {document.client.name && (
                  <View style={pdfStyles.clientRow}>
                    <Text style={pdfStyles.clientPrefix}>:الاسم</Text>
                    <Text style={pdfStyles.clientValue}>
                      {document.client.name}
                    </Text>
                  </View>
                )}
                {document.client.phone && (
                  <View style={pdfStyles.clientRow}>
                    <Text style={pdfStyles.clientPrefix}>:الهاتف</Text>
                    <Text style={pdfStyles.clientValue}>
                      {document.client.phone}
                    </Text>
                  </View>
                )}
                {document.client.email && (
                  <View style={pdfStyles.clientRow}>
                    <Text style={pdfStyles.clientPrefix}>
                      :البريد الإلكتروني
                    </Text>
                    <Text style={pdfStyles.clientValue}>
                      {document.client.email}
                    </Text>
                  </View>
                )}
              </View>
            )}

          {blocks.map((blockContent, blockIdx) => {
            // Guard: Handle undefined, null, or empty block fields safely
            if (!blockContent) return null;

            // Strict Validation Step: Check if the text segment is a
            // stringified JSON Quill Delta.
            const isJsonDelta = blockContent.trim().startsWith('{"ops"');

            // Fallback: pure text or old formatting configurations render
            // as a plain paragraph.
            if (!isJsonDelta) {
              return (
                <View
                  key={`block-fallback-${blockIdx}`}
                  style={pdfStyles.blockWrapper}
                >
                  <Text style={pdfStyles.alignLeft}>{blockContent}</Text>
                </View>
              );
            }

            return renderDeltaBlock(blockContent, blockIdx);
          })}

          {/* Footer: repeated on every page via react-pdf's `fixed` prop */}
          <View style={pdfStyles.footer} fixed>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {[company?.address, company?.phone, company?.email]
                .filter(Boolean)
                .map((field, i, arr) => (
                  <React.Fragment key={i}>
                    <Text style={pdfStyles.footerLine}>{field}</Text>
                    {i < arr.length - 1 && (
                      <Text style={pdfStyles.footerLine}>•</Text>
                    )}
                  </React.Fragment>
                ))}
            </View>

            {(company?.managerName ||
              company?.managerPhone ||
              company?.managerEmail) && (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 6,
                }}
              >
                {[
                  company?.managerName,
                  company?.managerPhone,
                  company?.managerEmail,
                ]
                  .filter(Boolean)
                  .map((field, i, arr) => (
                    <React.Fragment key={i}>
                      <Text style={pdfStyles.footerLine}>{field}</Text>
                      {i < arr.length - 1 && (
                        <Text style={pdfStyles.footerLine}>•</Text>
                      )}
                    </React.Fragment>
                  ))}
              </View>
            )}
          </View>
        </Page>
      ))}
    </Document>
  );
}
