import Main from "src/pages/Main";
import Nav from "src/components/Nav";
import Footer from "src/components/Footer";

export default function App() {
  return (
    <>
      <div id="welcome" aria-hidden />
      <Nav />
      <Main />
      <Footer />
    </>
  );
}
