import { StyleSheet, Font } from "@react-pdf/renderer";

// A color sitting between blue and teal, shared by the header, footer,
// page border, and watermark so they read as one consistent theme. The
// page-number badge uses a distinct, darker shade so it stands out
// against the footer band behind it.
const BRAND_COLOR = "#0E7C86";
const PAGE_NUMBER_BG = "#073B4C";
const PAGE_PADDING = 25;

Font.register({
  family: "Tajwal",
  fonts: [
    {
      src: `https://raw.githubusercontent.com/google/fonts/main/ofl/tajawal/Tajawal-Regular.ttf`,
      fontWeight: "normal",
    },
    {
      src: `https://raw.githubusercontent.com/google/fonts/main/ofl/tajawal/Tajawal-Bold.ttf`,
      fontWeight: "bold",
    },
  ],
});

export const pdfStyles = StyleSheet.create({
  // --- Page ---
  page: {
    padding: PAGE_PADDING,
    paddingBottom: 46,
    fontFamily: "Tajwal",
    fontSize: 11,
    lineHeight: 1.4,
    color: "#1a1a1a",
    // Thick frame around the whole page, matching the header/footer band.
    borderWidth: 10,
    borderStyle: "solid",
    borderColor: BRAND_COLOR,
  },

  // --- Header ---
  // Repeats on every page (`fixed`, set in dynamic-pdf-document.tsx).
  // Bled out to the page's true edges (negative margins cancel the page's
  // own padding) so the color band touches the border on all three sides.
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: BRAND_COLOR,
    marginTop: -PAGE_PADDING,
    marginHorizontal: -PAGE_PADDING,
    paddingHorizontal: PAGE_PADDING,
    paddingVertical: 10,
    marginBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  // --- Watermark ---
  // Company name rendered huge, semi-transparent, and rotated behind the
  // page content, repeated on every page. Percentage width/height (not a
  // left+right "stretch") is what react-pdf's layout engine reliably
  // supports for absolutely-positioned boxes, and it's what lets the text
  // wrap onto multiple lines instead of overflowing the page.
  watermarkContainer: {
    position: "absolute",
    top: "38%",
    left: "5%",
    width: "90%",
    height: "35%",
    alignItems: "center",
    justifyContent: "center",
  },
  watermarkText: {
    color: BRAND_COLOR,
    fontSize: 50,
    opacity: 0.25,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 1,
    whiteSpace: "normal",
    transform: "rotate(-45deg)",
  },

  // --- Client info box ---
  clientBox: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    border: "1px solid #3b82f6",
    alignItems: "flex-end",
  },
  clientLabel: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 4,
    textAlign: "right",
    width: "100%",
  },
  clientRow: {
    flexDirection: "row-reverse",
    marginBottom: 3,
  },
  clientPrefix: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  clientValue: {
    fontSize: 12,
  },

  // --- Block / paragraph layout ---
  paragraphWrapper: {
    marginBottom: 4,
    width: "100%",
  },
  blockWrapper: {
    marginBottom: 16,
    width: "100%",
  },

  // --- Typography weight combinations ---
  normal: {},
  bold: { fontWeight: "bold" },

  // --- Text alignment ---
  alignLeft: { textAlign: "left" as const },
  alignCenter: { textAlign: "center" as const },
  alignRight: { textAlign: "right" as const },
  alignJustify: { textAlign: "justify" as const },

  // --- Inline decoration ---
  underline: { textDecoration: "underline" as const },
  strikethrough: { textDecoration: "line-through" as const },

  // --- Block headings ---
  heading1: { fontSize: 22, fontWeight: "bold" },
  heading2: { fontSize: 17, fontWeight: "bold" },
  heading3: { fontSize: 14, fontWeight: "bold" },
  headingWrapper: { marginTop: 10, marginBottom: 6 },

  // RTL multi-run container: direction-run splitting (dynamic-pdf-document.tsx)
  // keeps each Arabic/Latin chunk internally intact (so "Invoice 4521" stays
  // together), but the *chunks themselves* still need to flow in RTL order —
  // the first chunk typed is the paragraph's logical start and belongs at
  // the right edge, with later chunks continuing leftward. row-reverse gives
  // us that: main-axis start becomes the right side, so source order
  // [chunk1, chunk2, chunk3] lands right-to-left as chunk1, chunk2, chunk3
  // (see rtlJustify in dynamic-pdf-document.tsx for the matching flip).
  rtlRunContainer: {
    flexDirection: "row-reverse" as const,
    flexWrap: "wrap" as const,
    width: "100%",
  },

  // --- Generic section helpers (kept for other/simpler templates) ---
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },

  // --- Footer ---
  // Absolute offsets are relative to the page's border-inner edge already
  // (not its padded content area), so 0 here sits flush against the
  // border — the earlier negative values were overshooting past the
  // physical page bounds entirely, which is why it wasn't showing up.
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: BRAND_COLOR,
    paddingHorizontal: 18,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerSide: {
    flex: 1,
  },
  footerSideRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  footerLine: {
    fontSize: 8.5,
    color: "#FFFFFF",
    marginBottom: 2,
  },
  // Plain (NOT row-reverse) row for the LEFT footer side (email/phone),
  // which reads left-to-right normally — first child sits at the left,
  // matching where that block is anchored.
  footerLineRow: {
    flexDirection: "row" as const,
    marginBottom: 2,
  },
  // Row-reverse variant for the RIGHT footer side. That side is
  // right-aligned (footerSideRight), so the first logical item (manager
  // name) needs to land at the outer/right edge, same as it did back when
  // this was one RTL-resolved string — row-reverse puts the first child at
  // the main-axis start, which is the right edge here.
  footerLineRowReverse: {
    flexDirection: "row-reverse" as const,
    marginBottom: 2,
  },
  // Separator between footer sub-line items. Uses real layout spacing
  // (marginHorizontal) rather than typed spaces — react-pdf trims
  // leading/trailing whitespace off each Text box independently, which is
  // why a literal " . " looked glued on one side no matter what.
  footerLineSeparator: {
    fontSize: 8.5,
    color: "#FFFFFF",
    marginHorizontal: 3,
  },
  // Center page-number badge: white border, background distinct from the
  // footer/header band color behind it.
  pageNumberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderStyle: "solid",
    borderColor: "#FFFFFF",
    backgroundColor: PAGE_NUMBER_BG,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  pageNumberText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
    // Page's base lineHeight (1.4) inflates this Text's line box well past
    // the glyph's actual height, so flexbox's own centering (on the box,
    // not the glyph) reads as visibly off-center. Tightening lineHeight to
    // ~1 keeps the box close to the glyph so the badge's centering lands
    // where it visually should.
    lineHeight: 0.8,
    textAlign: "center",
  },
});
