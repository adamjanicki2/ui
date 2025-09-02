import { Vfx } from "./types";

type Transformer = (classes: string[], vfx: Vfx) => void;

const transformers: Record<keyof Vfx, Transformer> = {
  // --- Layout ---
  pos: (classes, { pos }) => classes.push(`aui-pos-${pos}`),
  axis: (classes, { axis }) => classes.push(`aui-flex-${axis}`),
  gap: (classes, { gap }) => classes.push(`aui-gap-${gap}`),
  align: (classes, { align }) => classes.push(`aui-align-${align}`),
  justify: (classes, { justify }) => classes.push(`aui-justify-${justify}`),
  wrap: (classes) => classes.push("aui-flex-wrap"),
  overflow: (classes, { overflow }) => classes.push(`aui-ov-${overflow}`),
  overflowX: (classes, { overflowX }) => classes.push(`aui-ov-x-${overflowX}`),
  overflowY: (classes, { overflowY }) => classes.push(`aui-ov-y-${overflowY}`),
  z: (classes, { z }) => classes.push(`aui-z-${z}`),

  // --- Spacing ---
  padding: (classes, { padding }) => classes.push(`aui-pa-${padding}`),
  paddingX: (classes, { paddingX, paddingLeft, paddingRight }) => {
    if (!paddingLeft) classes.push(`aui-pl-${paddingX}`);
    if (!paddingRight) classes.push(`aui-pr-${paddingX}`);
  },
  paddingY: (classes, { paddingY, paddingTop, paddingBottom }) => {
    if (!paddingTop) classes.push(`aui-pt-${paddingY}`);
    if (!paddingBottom) classes.push(`aui-pb-${paddingY}`);
  },
  paddingTop: (classes, { paddingTop }) => classes.push(`aui-pt-${paddingTop}`),
  paddingBottom: (classes, { paddingBottom }) =>
    classes.push(`aui-pb-${paddingBottom}`),
  paddingLeft: (classes, { paddingLeft }) =>
    classes.push(`aui-pl-${paddingLeft}`),
  paddingRight: (classes, { paddingRight }) =>
    classes.push(`aui-pr-${paddingRight}`),

  margin: (classes, { margin }) => classes.push(`aui-ma-${margin}`),
  marginX: (classes, { marginX, marginLeft, marginRight }) => {
    if (!marginLeft) classes.push(`aui-ml-${marginX}`);
    if (!marginRight) classes.push(`aui-mr-${marginX}`);
  },
  marginY: (classes, { marginY, marginTop, marginBottom }) => {
    if (!marginTop) classes.push(`aui-mt-${marginY}`);
    if (!marginBottom) classes.push(`aui-mb-${marginY}`);
  },
  marginTop: (classes, { marginTop }) => classes.push(`aui-mt-${marginTop}`),
  marginBottom: (classes, { marginBottom }) =>
    classes.push(`aui-mb-${marginBottom}`),
  marginLeft: (classes, { marginLeft }) => classes.push(`aui-ml-${marginLeft}`),
  marginRight: (classes, { marginRight }) =>
    classes.push(`aui-mr-${marginRight}`),

  // --- Dimensions ---
  width: (classes, { width }) => classes.push(`aui-w-${width}`),
  maxWidth: (classes, { maxWidth }) => classes.push(`aui-mw-${maxWidth}`),
  height: (classes, { height }) => classes.push(`aui-h-${height}`),
  maxHeight: (classes, { maxHeight }) => classes.push(`aui-mh-${maxHeight}`),

  // --- Borders ---
  radius: (classes, { radius }) => classes.push(`aui-radius-${radius}`),
  border: (classes) => classes.push("aui-ba"),
  borderTop: (classes) => classes.push("aui-bt"),
  borderBottom: (classes) => classes.push("aui-bb"),
  borderLeft: (classes) => classes.push("aui-bl"),
  borderRight: (classes) => classes.push("aui-br"),
  borderWidth: (classes, { borderWidth }) =>
    classes.push(`aui-bw-${borderWidth}`),
  borderStyle: (classes, { borderStyle }) =>
    classes.push(`aui-bs-${borderStyle}`),
  borderColor: (classes, { borderColor }) =>
    classes.push(`aui-bc-${borderColor}`),

  // --- Effects ---
  shadow: (classes, { shadow }) => classes.push(`aui-shadow-${shadow}`),
  opacity: (classes, { opacity }) => classes.push(`aui-op-${opacity}`),

  // --- Typography ---
  fontSize: (classes, { fontSize }) => classes.push(`aui-f-${fontSize}`),
  fontWeight: (classes, { fontWeight }) => classes.push(`aui-fw-${fontWeight}`),
  textAlign: (classes, { textAlign }) => classes.push(`aui-ta-${textAlign}`),
  italics: (classes) => classes.push("aui-it"),

  // --- Colors ---
  color: (classes, { color }) => classes.push(`aui-c-${color}`),
  backgroundColor: (classes, { backgroundColor }) =>
    classes.push(`aui-bg-${backgroundColor}`),

  // --- Misc ---
  cursor: (classes, { cursor }) => classes.push(`aui-cursor-${cursor}`),
};

// Main function
export default function transformVfx(vfx: Vfx | undefined): string | null {
  if (!vfx) return null;

  const classes: string[] = [];

  Object.entries(vfx).forEach(([key, value]) => {
    if (value !== undefined) {
      const transformer = transformers[key as keyof Vfx];
      transformer(classes, vfx);
    }
  });

  return classes.join(" ") || null;
}
