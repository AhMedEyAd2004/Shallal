import { StyleSheet, Font } from "@react-pdf/renderer";

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
    padding: 50,
    paddingBottom: 70,
    fontFamily: "Tajwal",
    fontSize: 11,
    lineHeight: 1.4,
    color: "#1a1a1a",
  },

  // --- Header ---
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid #3b82f6",
    paddingBottom: 0,
    marginBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  companyNameSmall: {
    fontSize: 11,
    color: "#374151",
    marginTop: 20,
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

  // --- List items ---
  listItemRow: {
    flexDirection: "row" as const,
    alignItems: "flex-end" as const,
    marginBottom: 4,
    width: "100%",
  },
  listItemRowRTL: {
    flexDirection: "row-reverse" as const,
  },
  listMarker: { fontSize: 11 },
  listText: { flex: 1, fontSize: 11 },

  // RTL multi-run container: lays out individually-styled <Text>
  // elements right-to-left so we sidestep react-pdf's broken bidi
  // style-assignment that mis-colors runs in nested <Text> children.
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
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    borderTop: "1px solid #67e8f9",
    paddingTop: 8,
    fontSize: 9,
    color: "#0891b2",
    textAlign: "right",
    alignItems: "flex-end",
  },
  footerLine: {
    marginBottom: 2,
  },
});
