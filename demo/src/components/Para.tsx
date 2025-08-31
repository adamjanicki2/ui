import { ui } from "@adamjanicki/ui";

type Props = {
  children?: React.ReactNode | React.ReactNode[];
};

const Para = ({ children }: Props) => (
  <ui.p className="f5 fw4" style={{ lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
    {children}
  </ui.p>
);

export default Para;
