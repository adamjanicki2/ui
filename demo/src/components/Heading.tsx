import { Link, ui } from "@adamjanicki/ui";
import React from "react";
import "src/components/heading.css";

type Props = {
  level: 1 | 2 | 3;
  children: string;
};

function HashLink({ id }: { id: string }) {
  return (
    <Link className="octo" to={`#${id}`}>
      #
    </Link>
  );
}

function headingToId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "");
}

export default function Heading({ level, children }: Props) {
  const id = headingToId(children);
  const Element = ui[`h${level}`];
  return (
    <Element
      id={id}
      className="has-octo-within"
      vfx={{ axis: "x", align: "center" }}
    >
      <>
        <HashLink id={id} />
        {children}
      </>
    </Element>
  );
}
