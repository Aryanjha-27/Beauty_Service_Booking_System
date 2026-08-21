import { useState, useEffect } from "react";
import appData from "../data/appData";
import "./Navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollTo(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="navbar-inner">
        <button className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="nav-logo-icon">
            <i className="fas fa-spa"></i>
          </div>
          <span className="nav-logo-text">Glow Next</span>
        </button>

        <div className="nav-links">
          {appData.navLinks.map((link) => (
            <button
              key={link}
              className="nav-link"
              onClick={() => scrollTo(link.toLowerCase().replace(/ /g, "-"))}
            >
              {link}
            </button>
          ))}
        </div>

        <div className="nav-auth">
          <button className="btn-outline">Log In</button>
          <button className="btn-primary">Sign Up</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;