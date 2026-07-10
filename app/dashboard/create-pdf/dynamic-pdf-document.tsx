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
  isBlankLine?: boolean;
}

/**
 * Converts a Quill Delta's `ops` array into a flat list of paragraph
 * objects. Block-level attributes (align, header, direction) live on
 * the newline op that *ends* a line in Quill's format, so inline runs
 * are accumulated until a "\n" is hit, then flushed as one paragraph
 * using that newline op's attributes.
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
 * Maps a Quill text-align value to flexbox justifyContent for the RTL
 * run container. The container is row-reverse (see rtlRunContainer in
 * pdfStyles.ts) so chunks flow in proper RTL order; this just decides
 * which edge of the line that sequence hugs, using the flipped
 * flex-start/flex-end that row-reverse implies.
 */
const RTL_JUSTIFY: Record<string, any> = {
  // Container is row-reverse now, so main-axis "start" is the right edge
  // and "end" is the left edge — flex-start/flex-end are flipped relative
  // to what they'd mean in a plain row.
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

type ScriptDirection = "rtl" | "ltr";

// Common ASCII punctuation — . , ! ? : ; ' " ( ) [ ] { } - / etc.
const LATIN_PUNCTUATION_PATTERN = /[!-/:-@[-`{-~]/;

/**
 * Classifies a single character as belonging to an RTL script, an LTR
 * (Latin) script, or neutral (digits, whitespace). Neutral characters
 * have no direction of their own — a real bidi algorithm keeps them
 * attached to whichever surrounding run they fall inside, which is
 * exactly what paragraphRunsToDirectionChunks below does.
 *
 * Latin punctuation (., !, ?, quotes, parens, ...) is treated as `ltr`
 * rather than neutral — it should travel with the English/Latin word it
 * belongs to, the same as a letter would. Leaving it neutral let it glue
 * onto whichever chunk happened to be active at that point in the scan,
 * which is what caused marks like "!" or "?" to end up stranded at the
 * front of the reversed RTL sequence instead of staying attached to the
 * English text they were typed next to.
 */
function charDirection(ch: string): ScriptDirection | null {
  if (RTL_CHAR_PATTERN.test(ch)) return "rtl";
  if (/[a-zA-Z]/.test(ch)) return "ltr";
  if (LATIN_PUNCTUATION_PATTERN.test(ch)) return "ltr";
  return null; // digits and whitespace stay neutral
}

interface DirectionToken extends TextRun {
  // True when this token was immediately followed by a space before the
  // next token began (a script switch, or just a new inline-attribute
  // span) — e.g. the space between an Arabic word and the English word
  // after it, or between two differently-styled words in the same
  // script.
  gapAfter?: boolean;
}

interface DirectionChunk {
  // The script direction this whole chunk belongs to. A chunk can hold
  // several *tokens* (one per distinct set of inline attributes —
  // underline, color, ...) as long as the script doesn't change; it
  // only ends where the text actually switches between RTL and LTR.
  direction: ScriptDirection;
  tokens: DirectionToken[];
  // Gap before the *next* chunk, i.e. whether this chunk's source text
  // ended in a space.
  gapAfter?: boolean;
}

// Approximate width of one space character at the document's base font
// size — used to add the gap back in as real layout spacing rather than
// as a character.
const RTL_CHUNK_GAP = 3;

/**
 * Groups a whole paragraph's runs into direction-consistent chunks,
 * scanning across run (and therefore inline-attribute) boundaries
 * instead of resetting at each one.
 *
 * This matters because Quill starts a new op wherever inline formatting
 * changes — e.g. underlining one word in the middle of an English
 * phrase turns "hello i am ahmed" into three separate runs: "hello i ",
 * "am " (underlined), "ahmed ...". Tokenizing each run in isolation (the
 * old approach) turned those three runs into three independent flex
 * items inside the RTL row-reverse container below. row-reverse has no
 * way to know they were really one contiguous English phrase, so it
 * reordered them exactly like it reorders real script boundaries —
 * turning "hello i am ahmed" into "ahmed am hello i" the moment any
 * single word inside it got its own formatting.
 *
 * A chunk now only breaks where the *script* actually changes (Arabic
 * <-> Latin); neutral characters (digits, whitespace) stay glued to
 * whichever chunk they're already in, same as before. Differing inline
 * attributes mid-chunk produce additional *tokens* within the same
 * chunk instead of ending it, so a formatted word in the middle of an
 * English (or Arabic) phrase no longer fractures that phrase into
 * separately-reorderable pieces — it keeps reading in the original
 * order, and only the one word picks up the requested style.
 *
 * A space sitting right at a token or chunk boundary ends up glued to
 * the edge of whichever piece it's part of, and that piece is rendered
 * as its own isolated <Text> box. react-pdf trims leading/trailing
 * whitespace off each Text box independently (like a block element
 * collapsing edge whitespace in HTML), so that space gets silently
 * dropped no matter what character is used for it. So instead of
 * keeping it as a character at all, it's stripped out here and
 * reintroduced as `gapAfter`, which the renderer turns into real margin
 * — layout spacing can't be trimmed the way a text character can.
 */
function paragraphRunsToDirectionChunks(runs: TextRun[]): DirectionChunk[] {
  const chunks: DirectionChunk[] = [];

  let chunkDir: ScriptDirection | null = null;
  let chunkTokens: DirectionToken[] = [];
  let tokenText = "";
  let tokenAttrs: Record<string, any> = {};
  let hasToken = false;

  const attrsKey = (attrs: Record<string, any>) => JSON.stringify(attrs || {});

  function endToken() {
    if (!hasToken) return;
    const gapAfter = / $/.test(tokenText);
    const text = gapAfter ? tokenText.replace(/ +$/, "") : tokenText;
    if (text) chunkTokens.push({ text, attributes: tokenAttrs, gapAfter });
    tokenText = "";
    hasToken = false;
  }

  function endChunk() {
    endToken();
    if (chunkTokens.length > 0 && chunkDir) {
      const gapAfter = chunkTokens[chunkTokens.length - 1]?.gapAfter ?? false;
      chunks.push({ direction: chunkDir, tokens: chunkTokens, gapAfter });
    }
    chunkTokens = [];
    chunkDir = null;
  }

  for (const run of runs) {
    const attrs = run.attributes || {};
    for (const ch of Array.from(run.text)) {
      const dir = charDirection(ch);

      // Script switch: close out the chunk so far (its trailing space,
      // if any, becomes the gap before this new chunk).
      if (chunkDir !== null && dir !== null && dir !== chunkDir) {
        endChunk();
      }
      if (chunkDir === null && dir !== null) chunkDir = dir;

      // Attribute switch within the same chunk: close out the current
      // token only — the chunk itself keeps going.
      if (hasToken && attrsKey(attrs) !== attrsKey(tokenAttrs)) {
        endToken();
      }
      tokenAttrs = attrs;
      tokenText += ch;
      hasToken = true;
    }
  }
  endChunk();

  return chunks;
}

// Nested containers used only when a single direction-chunk contains
// more than one differently-styled token. An LTR chunk's tokens stay in
// plain reading order — a formatted word shouldn't reshuffle the
// English phrase it's part of. An RTL chunk's tokens still need
// row-reverse, for the same reason the top-level RTL paragraph does:
// each token is its own isolated flex item, and their positions
// relative to each other only come out right-to-left if the container
// reverses them.
const nestedLtrContainerStyle = {
  flexDirection: "row" as const,
  flexWrap: "wrap" as const,
};
const nestedRtlContainerStyle = {
  flexDirection: "row-reverse" as const,
  flexWrap: "wrap" as const,
};

/**
 * Renders a paragraph's runs as direction-chunk flex items for the
 * top-level RTL row-reverse container. Each chunk is one flex item;
 * a chunk with multiple differently-styled tokens renders those tokens
 * in a nested container using the *chunk's own* direction, instead of
 * being flattened into the outer container where they'd be reordered
 * as if each were its own top-level chunk.
 */
function renderDirectionChunks(runs: TextRun[], baseStyle?: any) {
  const chunks = paragraphRunsToDirectionChunks(runs);

  return chunks.map((chunk, cIdx) => {
    const isRTL = chunk.direction === "rtl";
    // This chunk is a flex item in the *outer* container, which is
    // always row-reverse regardless of this particular chunk's own
    // script (the outer container only flips between chunks — Arabic
    // and English alike — never between tokens inside one). So the gap
    // before the *next chunk* always sits to this item's visual left,
    // no matter whether this chunk itself is RTL or LTR.
    const outerGapStyle = chunk.gapAfter ? { marginLeft: RTL_CHUNK_GAP } : {};

    if (chunk.tokens.length === 1) {
      const token = chunk.tokens[0];
      return (
        <Text
          key={cIdx}
          style={[...buildRunStyle(token, baseStyle), outerGapStyle]}
        >
          {token.text}
        </Text>
      );
    }

    return (
      <View
        key={cIdx}
        style={[
          isRTL ? nestedRtlContainerStyle : nestedLtrContainerStyle,
          outerGapStyle,
        ]}
      >
        {chunk.tokens.map((token, tIdx) => {
          const isLast = tIdx === chunk.tokens.length - 1;
          const innerGap =
            !isLast && token.gapAfter
              ? isRTL
                ? { marginLeft: RTL_CHUNK_GAP }
                : { marginRight: RTL_CHUNK_GAP }
              : {};
          return (
            <Text
              key={tIdx}
              style={[...buildRunStyle(token, baseStyle), innerGap]}
            >
              {token.text}
            </Text>
          );
        })}
      </View>
    );
  });
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
              ] as any
            }
          >
            {isRTLParagraph ? (
              <View
                style={[pdfStyles.rtlRunContainer, rtlJustify(para.alignment)]}
              >
                {renderDirectionChunks(
                  para.runs,
                  headingStyle || pdfStyles.normal,
                )}
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
