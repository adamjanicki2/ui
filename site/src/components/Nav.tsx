import { useState } from "react";
import { Turn as Hamburger } from "hamburger-react";
import "src/components/nav.css";
import { Link, UnstyledLink } from "@adamjanicki/ui";

type NavlinkProps = {
  to: string;
  children: React.ReactNode;
};

const Nav = () => {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  const Navlink = (props: NavlinkProps) => (
    <li className="navlink-li">
      <Link className="navlink" onClick={closeMenu} {...props} />
    </li>
  );

  return (
    <nav className="flex items-center justify-between w-100 nav pv2 ph4">
      <div className="flex items-center justify-between bar-container">
        <UnstyledLink className="nav-title" to="#welcome">
          @adamjanicki/ui
        </UnstyledLink>
        <div className="mobile">
          <Hamburger
            toggled={open}
            onToggle={() => setOpen(!open)}
            direction="left"
            size={24}
            duration={0.3}
          />
        </div>
      </div>
      <ul
        className="flex items-center desktop link-container ma0"
        style={{ display: open ? "flex" : undefined }}
      >
        <Navlink to="#welcome">Welcome</Navlink>
        <Navlink to="#components">Components</Navlink>
        <Navlink to="#hooks">Hooks</Navlink>
        <Navlink to="#functions">Functions</Navlink>
      </ul>
    </nav>
  );
};

export default Nav;
