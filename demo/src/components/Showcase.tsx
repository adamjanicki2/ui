import React from "react";
import { Box } from "@adamjanicki/ui";
import Heading from "src/components/Heading";
import Para from "src/components/Para";
import HiddenSnippet from "src/components/HiddenSnippet";

type BoxProps = React.ComponentProps<typeof Box>;

type ShowcaseBlockProps = {
  title: string;
  description?: React.ReactNode;
  snippet?: string;
  children: React.ReactNode;
};

export function ShowcaseBlock({
  title,
  description,
  snippet,
  children,
}: ShowcaseBlockProps) {
  return (
    <>
      <Heading level={2}>{title}</Heading>
      {description ? <Para>{description}</Para> : null}
      {children}
      {snippet ? <HiddenSnippet>{snippet}</HiddenSnippet> : null}
    </>
  );
}

type ShowcaseRowProps = Omit<BoxProps, "children"> & {
  children: React.ReactNode;
};

export function ShowcaseRow({ vfx, ...props }: ShowcaseRowProps) {
  return (
    <Box
      {...props}
      vfx={{
        axis: "x",
        align: "center",
        justify: "center",
        gap: "s",
        padding: "xs",
        wrap: true,
        ...vfx,
      }}
    />
  );
}

export function LabeledField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box>
      <Box vfx={{ marginBottom: "xs", fontWeight: 5, fontSize: "s" }}>
        {label}
      </Box>
      {children}
    </Box>
  );
}
