import "src/components/heading.css";

import { Link, ui } from "@adamjanicki/ui";

type Props = {
  children: string;
};

const headingToId = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/gi, "");

export default function Heading({ children }: Props) {
  const id = headingToId(children);
  return (
    <ui.h2
      id={id}
      className="has-octo-within"
      vfx={{ axis: "x", align: "center", width: "full" }}
    >
      <Link className="octo" to={`#${id}`}>
        #
      </Link>
      {children}
    </ui.h2>
  );
}
