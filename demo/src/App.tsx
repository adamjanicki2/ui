import { BrowserRouter, Routes, Route } from "react-router";
import Home from "src/components/Home";
import Nav from "src/components/Nav";
import Footer from "src/components/Footer";
import { Box, useScrollToHash } from "@adamjanicki/ui";
import { useSetDocumentTheme } from "src/hooks";
import Presentation from "src/sections/Presentation";
import Signals from "src/sections/Signals";
import UserAction from "src/sections/UserAction";
import Miscellaneous from "src/sections/Miscellaneous";
import NotFound from "src/components/NotFound";

export default function App() {
  useScrollToHash();
  useSetDocumentTheme();

  return (
    <BrowserRouter basename="/ui">
      <Nav />
      <Box className="main-container" vfx={{ width: "full" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/presentation" element={<Presentation />} />
          <Route path="/signals" element={<Signals />} />
          <Route path="/user-action" element={<UserAction />} />
          <Route path="/miscellaneous" element={<Miscellaneous />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
      <Footer />
    </BrowserRouter>
  );
}
