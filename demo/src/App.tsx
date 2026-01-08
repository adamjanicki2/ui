import { Box, Route, Router, Routes } from "@adamjanicki/ui";
import Footer from "src/components/Footer";
import Nav from "src/components/Nav";
import { useSetDocumentTheme } from "src/hooks";
import Action from "src/pages/Action";
import Home from "src/pages/Home";
import Miscellaneous from "src/pages/Miscellaneous";
import NotFound from "src/pages/NotFound";
import Overlay from "src/pages/Overlay";
import Presentation from "src/pages/Presentation";
import Signals from "src/pages/Signals";

export default function App() {
  useSetDocumentTheme();

  return (
    <Router basename="/ui">
      <Nav />
      <Box className="main-container" vfx={{ width: "full" }}>
        <Routes fallback={<NotFound />}>
          <Route path="/" element={<Home />} />
          <Route path="/presentation" element={<Presentation />} />
          <Route path="/signals" element={<Signals />} />
          <Route path="/action" element={<Action />} />
          <Route path="/miscellaneous" element={<Miscellaneous />} />
          <Route path="/overlay" element={<Overlay />} />
        </Routes>
      </Box>
      <Footer />
    </Router>
  );
}
