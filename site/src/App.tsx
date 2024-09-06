import Main from "src/pages/Main";
import Nav from "src/components/Nav";
import Footer from "src/components/Footer";
import { useScrollToHash } from "@adamjanicki/ui";
import { useEffect } from "react";

export default function App() {
  const scroll = useScrollToHash();

  useEffect(() => {
    // scroll to doc heading if available
    scroll();
  }, [scroll]);

  return (
    <>
      <div id="welcome" aria-hidden />
      <Nav />
      <Main />
      <Footer />
    </>
  );
}
