import { NavLink, Route, Routes } from "react-router-dom";
import NewsPage from "./NewsPage.jsx";
import NotesPage from "./NotesPage.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/">
          <span className="brand-mark">N</span>
          News Horizon
        </NavLink>

        <nav aria-label="Main navigation">
          <NavLink end to="/">Top stories</NavLink>
          <NavLink to="/notes">My notes</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<NewsPage />} />
          <Route path="/notes" element={<NotesPage />} />
        </Routes>
      </main>

      <footer>Stay curious. Stay informed.</footer>
    </div>
  );
}