import Nav from "src/components/Nav";
import Footer from "src/components/Footer";
import { Box, Router, Routes, Route } from "@adamjanicki/ui";
import { useSetDocumentTheme } from "src/hooks";
import Presentation from "src/pages/Presentation";
import Signals from "src/pages/Signals";
import Action from "src/pages/Action";
import Miscellaneous from "src/pages/Miscellaneous";
import Home from "src/pages/Home";
import NotFound from "src/pages/NotFound";

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
        </Routes>
      </Box>
      <Footer />
    </Router>
  );
}
