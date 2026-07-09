import React from "react";
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { CompanySettings, DocumentData } from "./pdf";
import { pdfStyles } from "./pdfStyles";

// All layout/typography styles now live in pdfStyles.ts (single source of
// truth for every PDF template) — see that file for the definitions.

// Arabic (and other RTL script) Unicode ranges — used to decide marker side
// and text alignment per-paragraph, since a document can mix LTR/RTL blocks.
const RTL_CHAR_PATTERN =
  /[\u0591-\u07FF\u08A0-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;

function isRTLText(text: string) {
  return RTL_CHAR_PATTERN.test(text);
}

const BULLET_CHARS = ["•", "◦", "▪"];

function bulletFor(indentLevel: number) {
  return BULLET_CHARS[Math.min(indentLevel, BULLET_CHARS.length - 1)];
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

            // Strict Validation Step: Check if the text segment is a stringified JSON layout
            const isJsonDelta = blockContent.trim().startsWith('{"ops"');

            // Fallback: If it is pure text or old formatting configurations, parse standard layouts
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

            try {
              const deltaObj = JSON.parse(blockContent);
              const ops: any[] = deltaObj.ops || [];

              const paragraphs: any[] = [];
              let currentLineTextRuns: any[] = [];

              ops.forEach((op) => {
                if (!op.insert) return;

                // Handle structural text mutations
                if (typeof op.insert === "string") {
                  // Check if this specific string chunk contains a trailing line break or enter command
                  if (op.insert.includes("\n")) {
                    const parts = op.insert.split("\n");

                    // Pushes characters preceding the split line straight to the memory layer
                    if (parts[0]) {
                      currentLineTextRuns.push({
                        text: parts[0],
                        attributes: op.attributes || {},
                      });
                    }

                    // Extract layout adjustments off Quill's block level trace variables
                    const alignment = op.attributes?.align || "left";
                    let alignStyle = pdfStyles.alignLeft;
                    if (alignment === "center")
                      alignStyle = pdfStyles.alignCenter;
                    else if (alignment === "right")
                      alignStyle = pdfStyles.alignRight;
                    else if (alignment === "justify")
                      alignStyle = pdfStyles.alignJustify;

                    // Block-level attributes (header, list, indent) also live on
                    // the newline op, same as alignment above.
                    const headerLevel: number | null =
                      op.attributes?.header || null;
                    const listType: "bullet" | "ordered" | null =
                      op.attributes?.list || null;
                    const indentLevel: number = op.attributes?.indent || 0;
                    // Explicit direction set via the editor's RTL toggle button.
                    // When present it overrides our best-guess language
                    // detection below — the user has told us directly.
                    const direction: "rtl" | null =
                      op.attributes?.direction === "rtl" ? "rtl" : null;

                    // Compile the accumulated runs straight into a standalone line block
                    paragraphs.push({
                      runs: [...currentLineTextRuns],
                      alignStyle: alignStyle,
                      alignment,
                      direction,
                      headerLevel,
                      listType,
                      indentLevel,
                    });

                    // Completely flush the active memory trace layer
                    currentLineTextRuns = [];

                    // Loop through consecutive empty strings if a user hits Enter multiple times
                    for (let i = 1; i < parts.length - 1; i++) {
                      const isBlankLine = !parts[i];
                      paragraphs.push({
                        runs: [
                          {
                            text: parts[i] || " ",
                            attributes: op.attributes || {},
                          },
                        ],
                        alignStyle: alignStyle,
                        isBlankLine,
                      });
                    }

                    // Cache any remaining tail fragment strings for the upcoming iteration cycle
                    if (parts[parts.length - 1]) {
                      currentLineTextRuns.push({
                        text: parts[parts.length - 1],
                        attributes: op.attributes || {},
                      });
                    }
                  } else {
                    // Standard inline character node segment
                    currentLineTextRuns.push({
                      text: op.insert,
                      attributes: op.attributes || {},
                    });
                  }
                }
              });

              // Catch any remaining unclosed elements lying inside the line run buffer queue
              if (currentLineTextRuns.length > 0) {
                paragraphs.push({
                  runs: [...currentLineTextRuns],
                  alignStyle: pdfStyles.alignLeft,
                });
              }

              // Map properties cleanly into structured layout elements.
              const renderRuns = (runs: any[]) =>
                runs.map((run: any, rIdx: number) => {
                  const runStyle: any[] = [];
                  // Bold is intentionally never applied here. The Tajawal
                  // bold weight breaks rendering for Arabic text, which is
                  // why "bold" is excluded from the editor's format
                  // whitelist in document-form-panel.tsx. This is a second
                  // guard so any document saved *before* that whitelist
                  // existed (and still has bold:true in its stored delta
                  // JSON) can't reintroduce the crash either.
                  if (run.attributes?.underline)
                    runStyle.push(pdfStyles.underline);
                  if (run.attributes?.strike)
                    runStyle.push(pdfStyles.strikethrough);
                  if (run.attributes?.color)
                    runStyle.push({ color: run.attributes.color });
                  if (run.attributes?.background)
                    runStyle.push({
                      backgroundColor: run.attributes.background,
                    });

                  return (
                    <Text key={rIdx} style={runStyle}>
                      {run.text}
                    </Text>
                  );
                });

              return (
                <View
                  key={`block-json-${blockIdx}`}
                  style={pdfStyles.blockWrapper}
                >
                  {paragraphs.map((para, pIdx) => {
                    // Filter out completely corrupted, uninitialized text line segments
                    if (para.runs.length === 0) return null;

                    // An intentional blank line (user pressed Enter twice): render
                    // as a small fixed spacer rather than a full text line with its
                    // own line-height + margin, which would otherwise compound into
                    // an oversized gap.
                    if (para.isBlankLine) {
                      return <View key={pIdx} style={{ height: 6 }} />;
                    }

                    const indentPadding = (para.indentLevel || 0) * 20;

                    // Bullet list items. Numbering has been removed —
                    // any list (including legacy "ordered" data from
                    // older saved documents) renders as a bullet marker.
                    if (
                      para.listType === "bullet" ||
                      para.listType === "ordered"
                    ) {
                      const marker = bulletFor(para.indentLevel || 0);
                      const paraText = para.runs
                        .map((run: any) => run.text || "")
                        .join("");
                      // Explicit direction (from the editor's RTL button) wins
                      // over auto-detection — the user told us directly.
                      const lang: "ar" | "en" =
                        para.direction === "rtl"
                          ? "ar"
                          : isRTLText(paraText)
                            ? "ar"
                            : "en";

                      // Marker side rule:
                      //  - justify right + lang ar  -> marker on the right
                      //  - justify left  + lang en  -> marker on the left
                      //  - anything else (center/justify align, or an
                      //    align/lang mismatch) -> just follow the language
                      let markerOnRight: boolean;
                      if (para.alignment === "right" && lang === "ar") {
                        markerOnRight = true;
                      } else if (para.alignment === "left" && lang === "en") {
                        markerOnRight = false;
                      } else {
                        markerOnRight = lang === "ar";
                      }

                      return (
                        <View
                          key={pIdx}
                          style={[
                            pdfStyles.listItemRow,
                            markerOnRight && pdfStyles.listItemRowRTL,
                            markerOnRight
                              ? { paddingRight: indentPadding }
                              : { paddingLeft: indentPadding },
                          ]}
                        >
                          <Text
                            style={[
                              pdfStyles.listMarker,
                              markerOnRight
                                ? { marginLeft: 3 }
                                : { marginRight: 3 },
                            ]}
                          >
                            {marker}
                          </Text>
                          <Text style={[pdfStyles.listText, para.alignStyle]}>
                            {renderRuns(para.runs)}
                          </Text>
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
                        style={[
                          pdfStyles.paragraphWrapper,
                          para.alignStyle,
                          headingStyle && pdfStyles.headingWrapper,
                          { paddingLeft: indentPadding },
                        ]}
                      >
                        <Text style={headingStyle || pdfStyles.normal}>
                          {renderRuns(para.runs)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              );
            } catch (error) {
              console.error(
                "Failed parsing current structural JSON block:",
                error,
              );
              return (
                <View key={`error-${blockIdx}`} style={pdfStyles.blockWrapper}>
                  <Text style={pdfStyles.alignLeft}>{blockContent}</Text>
                </View>
              );
            }
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
