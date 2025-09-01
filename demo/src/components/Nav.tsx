import { useState } from "react";
import "src/components/nav.css";
import { Link, UnstyledLink, Hamburger, Box, ui, Icon } from "@adamjanicki/ui";

type NavlinkProps = {
  to: string;
  children: React.ReactNode;
};

const Nav = () => {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  const Navlink = (props: NavlinkProps) => (
    <ui.li className="navlink-li">
      <Link className="navlink" onClick={closeMenu} {...props} />
    </ui.li>
  );

  return (
    <ui.nav
      vfx={{
        axis: "x",
        align: "center",
        justify: "between",
        width: "full",
        paddingY: "s",
        paddingX: "l",
      }}
      className="nav"
    >
      <Box
        vfx={{ axis: "x", align: "center", justify: "between" }}
        className="bar-container"
      >
        <UnstyledLink className="nav-title" to="#welcome">
          <Box className="desktop">@adamjanicki/ui</Box>
          <Icon icon="architect" size="l" className="mobile" />
        </UnstyledLink>
        <Box className="mobile">
          <Hamburger open={open} onClick={() => setOpen(!open)} />
        </Box>
      </Box>
      <ui.ul
        vfx={{ axis: "x", align: "center", margin: "none" }}
        className="desktop link-container"
        style={{ display: open ? "flex" : undefined }}
      >
        <Navlink to="#presentation">Presentation</Navlink>
        <Navlink to="#signals">Signals</Navlink>
        <Navlink to="#user-action">User Action</Navlink>
        <Navlink to="#miscellaneous">Miscellaneous</Navlink>
      </ui.ul>
    </ui.nav>
  );
};

export default Nav;
