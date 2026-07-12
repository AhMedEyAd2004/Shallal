import React from "react";
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { CompanySettings, DocumentData } from "./pdf";
import { pdfStyles } from "./pdfStyles";

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
        paragraphs.push({
          runs: [{ text: part || " ", attributes: op.attributes || {} }],
          isBlankLine: !part,
          ...blockMeta,
        });
      }
    });
  }

  if (currentRuns.length > 0) {
    paragraphs.push({ runs: currentRuns, alignStyle: pdfStyles.alignLeft });
  }

  return paragraphs;
}

const RTL_JUSTIFY: Record<string, any> = {
  right: { justifyContent: "flex-start" as const },
  left: { justifyContent: "flex-end" as const },
  center: { justifyContent: "center" as const },
};

function rtlJustify(alignment?: string): any {
  return RTL_JUSTIFY[alignment || "right"] || RTL_JUSTIFY.right;
}

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

const LATIN_PUNCTUATION_PATTERN = /[!-/:-@[-`{-~]/;

function charDirection(ch: string): ScriptDirection | null {
  if (RTL_CHAR_PATTERN.test(ch)) return "rtl";
  if (/[a-zA-Z]/.test(ch)) return "ltr";
  if (LATIN_PUNCTUATION_PATTERN.test(ch)) return "ltr";
  return null;  
}

interface DirectionToken extends TextRun {
  gapAfter?: boolean;
}

interface DirectionChunk {
  direction: ScriptDirection;
  tokens: DirectionToken[];
  gapAfter?: boolean;
}

const RTL_CHUNK_GAP = 3;

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

      if (chunkDir !== null && dir !== null && dir !== chunkDir) {
        endChunk();
      }
      if (chunkDir === null && dir !== null) chunkDir = dir;

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

const nestedLtrContainerStyle = {
  flexDirection: "row" as const,
  flexWrap: "wrap" as const,
};
const nestedRtlContainerStyle = {
  flexDirection: "row-reverse" as const,
  flexWrap: "wrap" as const,
};

function renderDirectionChunks(runs: TextRun[], baseStyle?: any) {
  const chunks = paragraphRunsToDirectionChunks(runs);

  return chunks.map((chunk, cIdx) => {
    const isRTL = chunk.direction === "rtl";
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

function renderRuns(runs: TextRun[]) {
  return runs.map((run, rIdx) => {
    const runStyle: any[] = [];
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
        if (para.runs.length === 0) return null;

        if (para.isBlankLine) {
          return <View key={pIdx} style={{ height: 6 }} />;
        }

        const paraText = para.runs.map((run) => run.text || "").join("");
        const isRTLParagraph = para.direction === "rtl" || isRTLText(paraText);

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
  const currentPages: string[][] =
    document?.pages && document.pages.length > 0
      ? document.pages
      : [[document?.content || ""]];

  const companyName = company?.companyName || "";

  return (
    <Document>
      {currentPages.map((blocks, pageIdx) => (
        <Page key={`page-${pageIdx}`} size="A4" style={pdfStyles.page}>
          {companyName && (
            <View style={pdfStyles.watermarkContainer} fixed>
              <Text style={[pdfStyles.watermarkText]}>{companyName}</Text>
            </View>
          )}

          <View style={pdfStyles.header} fixed>
            <Text style={pdfStyles.title}>{document?.title || "مستند"}</Text>
            {company?.logo && (
              <Image src={company.logo} style={pdfStyles.logo} />
            )}
          </View>

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
            if (!blockContent) return null;

            const isJsonDelta = blockContent.trim().startsWith('{"ops"');

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

          <View style={pdfStyles.footer}>
            <View style={pdfStyles.footerSide}>
              {company?.email && (
                <Text style={pdfStyles.footerLine}>{company.email}</Text>
              )}
              {(company?.phone || company?.address) && (
                <View style={pdfStyles.footerLineRow}>
                  {company?.phone && (
                    <Text style={[pdfStyles.footerLine, { marginBottom: 0 }]}>
                      {company.phone}
                    </Text>
                  )}
                  {company?.phone && company?.address && (
                    <Text style={pdfStyles.footerLineSeparator}>•</Text>
                  )}
                  {company?.address && (
                    <Text style={[pdfStyles.footerLine, { marginBottom: 0 }]}>
                      {company.address}
                    </Text>
                  )}
                </View>
              )}
            </View>

            <View style={pdfStyles.pageNumberBadge}>
              <Text style={pdfStyles.pageNumberText}>{pageIdx + 1}</Text>
            </View>

            <View style={pdfStyles.footerSideRight}>
              {(company?.managerName || company?.managerPhone) && (
                <View style={pdfStyles.footerLineRowReverse}>
                  {company?.managerName && (
                    <Text style={[pdfStyles.footerLine, { marginBottom: 0 }]}>
                      {company.managerName}
                    </Text>
                  )}
                  {company?.managerName && company?.managerPhone && (
                    <Text style={pdfStyles.footerLineSeparator}>•</Text>
                  )}
                  {company?.managerPhone && (
                    <Text style={[pdfStyles.footerLine, { marginBottom: 0 }]}>
                      {company.managerPhone}
                    </Text>
                  )}
                </View>
              )}
              {company?.managerEmail && (
                <Text style={pdfStyles.footerLine}>{company.managerEmail}</Text>
              )}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
}
