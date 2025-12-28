import {
  Link as UILink,
  UnstyledLink as UIUnstyledLink,
} from "@adamjanicki/ui";
import { Link as RouterLink } from "react-router";

type Props = React.ComponentProps<typeof UILink>;

export default function Link(props: Props) {
  return <UILink LinkElement={RouterLink} {...props} />;
}

export function UnstyledLink(
  props: React.ComponentProps<typeof UIUnstyledLink>
) {
  return <UIUnstyledLink LinkElement={RouterLink} {...props} />;
}
