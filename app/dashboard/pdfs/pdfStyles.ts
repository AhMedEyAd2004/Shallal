import { StyleSheet, Font } from "@react-pdf/renderer";

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
  page: {
    padding: PAGE_PADDING,
    paddingBottom: 46,
    fontFamily: "Tajwal",
    fontSize: 11,
    lineHeight: 1.4,
    color: "#1a1a1a",
    borderWidth: 10,
    borderStyle: "solid",
    borderColor: BRAND_COLOR,
  },

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

  paragraphWrapper: {
    marginBottom: 4,
    width: "100%",
  },
  blockWrapper: {
    marginBottom: 16,
    width: "100%",
  },

  normal: {},
  bold: { fontWeight: "bold" },

  alignLeft: { textAlign: "left" as const },
  alignCenter: { textAlign: "center" as const },
  alignRight: { textAlign: "right" as const },
  alignJustify: { textAlign: "justify" as const },

  underline: { textDecoration: "underline" as const },
  strikethrough: { textDecoration: "line-through" as const },

  heading1: { fontSize: 22, fontWeight: "bold" },
  heading2: { fontSize: 17, fontWeight: "bold" },
  heading3: { fontSize: 14, fontWeight: "bold" },
  headingWrapper: { marginTop: 10, marginBottom: 6 },

  rtlRunContainer: {
    flexDirection: "row-reverse" as const,
    flexWrap: "wrap" as const,
    width: "100%",
  },

  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },

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
  footerLineRow: {
    flexDirection: "row" as const,
    marginBottom: 2,
  },
  footerLineRowReverse: {
    flexDirection: "row-reverse" as const,
    marginBottom: 2,
  },
  footerLineSeparator: {
    fontSize: 8.5,
    color: "#FFFFFF",
    marginHorizontal: 3,
  },
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
    lineHeight: 0.8,
    textAlign: "center",
  },
});
