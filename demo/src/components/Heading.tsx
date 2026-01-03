import { Link, ui } from "@adamjanicki/ui";
import React from "react";
import "src/components/heading.css";

type Props = {
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

export default function Heading({ children }: Props) {
  const id = headingToId(children);
  return (
    <ui.h2
      id={id}
      className="has-octo-within"
      vfx={{ axis: "x", align: "center", width: "full" }}
    >
      <>
        <HashLink id={id} />
        {children}
      </>
    </ui.h2>
  );
}
