import { useEffect, useState } from "react";
import { Turn as Hamburger } from "hamburger-react";
import "src/components/nav.css";
import Link, { UnstyledLink } from "src/components/Link";
import { useLocation } from "react-router-dom";

type NavlinkProps = {
  to: string;
  children: React.ReactNode;
};

const Nav = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  const Navlink = (props: NavlinkProps) => (
    <li className="navlink-li">
      <Link className="navlink" onClick={closeMenu} {...props} />
    </li>
  );

  return (
    <nav className="flex items-center justify-between w-100 nav pv2 ph4">
      <div className="flex items-center justify-between bar-container">
        <UnstyledLink className="nav-title" to="/">
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
        <Navlink to="/">Home</Navlink>
        <Navlink to="/about/">About</Navlink>
      </ul>
    </nav>
  );
};

export default Nav;
