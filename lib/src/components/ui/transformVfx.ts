import { Vfx } from "../../types/common";

type Transformer = (vfx: Vfx) => string;

const transformers: Record<keyof Vfx, Transformer> = {
  // --- Layout ---
  pos: ({ pos }) => `aui-pos-${pos}`,
  axis: ({ axis }) => `aui-flex-${axis}`,
  gap: ({ gap }) => `aui-gap-${gap}`,
  align: ({ align }) => `aui-align-${align}`,
  justify: ({ justify }) => `aui-justify-${justify}`,
  stretch: ({ stretch }) => `aui-stretch-${stretch}`,
  wrap: () => "aui-flex-wrap",
  overflow: ({ overflow }) => `aui-ov-${overflow}`,
  overflowX: ({ overflowX }) => `aui-ov-x-${overflowX}`,
  overflowY: ({ overflowY }) => `aui-ov-y-${overflowY}`,
  z: ({ z }) => `aui-z-${z}`,

  // --- Spacing ---
  padding: ({ padding }) => `aui-pa-${padding}`,
  paddingX: ({ paddingX, paddingLeft, paddingRight }) => {
    const result: string[] = [];
    if (!paddingLeft) result.push(`aui-pl-${paddingX}`);
    if (!paddingRight) result.push(`aui-pr-${paddingX}`);
    return result.join(" ");
  },
  paddingY: ({ paddingY, paddingTop, paddingBottom }) => {
    const result: string[] = [];
    if (!paddingTop) result.push(`aui-pt-${paddingY}`);
    if (!paddingBottom) result.push(`aui-pb-${paddingY}`);
    return result.join(" ");
  },
  paddingTop: ({ paddingTop }) => `aui-pt-${paddingTop}`,
  paddingBottom: ({ paddingBottom }) => `aui-pb-${paddingBottom}`,
  paddingLeft: ({ paddingLeft }) => `aui-pl-${paddingLeft}`,
  paddingRight: ({ paddingRight }) => `aui-pr-${paddingRight}`,

  margin: ({ margin }) => `aui-ma-${margin}`,
  marginX: ({ marginX, marginLeft, marginRight }) => {
    const result: string[] = [];
    if (!marginLeft) result.push(`aui-ml-${marginX}`);
    if (!marginRight) result.push(`aui-mr-${marginX}`);
    return result.join(" ");
  },
  marginY: ({ marginY, marginTop, marginBottom }) => {
    const result: string[] = [];
    if (!marginTop) result.push(`aui-mt-${marginY}`);
    if (!marginBottom) result.push(`aui-mb-${marginY}`);
    return result.join(" ");
  },
  marginTop: ({ marginTop }) => `aui-mt-${marginTop}`,
  marginBottom: ({ marginBottom }) => `aui-mb-${marginBottom}`,
  marginLeft: ({ marginLeft }) => `aui-ml-${marginLeft}`,
  marginRight: ({ marginRight }) => `aui-mr-${marginRight}`,

  // --- Dimensions ---
  width: ({ width }) => `aui-w-${width}`,
  minWidth: ({ minWidth }) => `aui-minw-${minWidth}`,
  maxWidth: ({ maxWidth }) => `aui-maxw-${maxWidth}`,
  height: ({ height }) => `aui-h-${height}`,
  minHeight: ({ minHeight }) => `aui-minh-${minHeight}`,
  maxHeight: ({ maxHeight }) => `aui-maxh-${maxHeight}`,

  // --- Borders ---
  radius: ({ radius }) => `aui-radius-${radius}`,
  border: () => "aui-ba",
  borderTop: () => "aui-bt",
  borderBottom: () => "aui-bb",
  borderLeft: () => "aui-bl",
  borderRight: () => "aui-br",
  borderWidth: ({ borderWidth }) => `aui-bw-${borderWidth}`,
  borderStyle: ({ borderStyle }) => `aui-bs-${borderStyle}`,
  borderColor: ({ borderColor }) => `aui-bc-${borderColor}`,

  // --- Effects ---
  shadow: ({ shadow }) => `aui-shadow-${shadow}`,
  opacity: ({ opacity }) => `aui-op-${opacity}`,
  hover: ({ hover }) => `aui-hov-${hover}`,

  // --- Typography ---
  fontSize: ({ fontSize }) => `aui-f-${fontSize}`,
  fontWeight: ({ fontWeight }) => `aui-fw-${fontWeight}`,
  textAlign: ({ textAlign }) => `aui-ta-${textAlign}`,
  italics: () => "aui-it",
  lineHeight: ({ lineHeight }) => `aui-lh-${lineHeight}`,

  // --- Colors ---
  color: ({ color }) => `aui-c-${color}`,
  backgroundColor: ({ backgroundColor }) => `aui-bg-${backgroundColor}`,

  // --- Misc ---
  cursor: ({ cursor }) => `aui-cursor-${cursor}`,
};

export default function transformVfx(vfx: Vfx | undefined): string | null {
  if (!vfx) return null;

  const classes: string[] = [];

  Object.entries(vfx).forEach(([key, value]) => {
    const transformer = transformers[key as keyof Vfx];
    const result = transformer(vfx);
    if (value && result) {
      classes.push(result);
    }
  });

  return classes.join(" ") || null;
}
