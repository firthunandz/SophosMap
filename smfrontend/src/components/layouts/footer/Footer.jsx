import { Link } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
  const [showCredits, setShowCredits] = useState(false);

  return (
    <footer className="bg-parchment text-ink-black font-cinzel text-sm xl:text-lg">
      <div className="container mx-auto px-4 py-2 flex items-center justify-center sm:justify-around">
        <nav className="flex gap-8 xs:justify-center">
          <Link to="/contact" className="hover:font-semibold">Contacto</Link>
          <Link to="/reviews" className="hover:font-semibold">Reseñas</Link>
        </nav>
        <a
          href="https://www.linkedin.com/in/fernando-chiesa/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:font-semibold transition hidden sm:inline-block whitespace-nowrap"
        >
          Proyecto hecho por Firthunandz
        </a>
      </div>
    </footer>
  );
};

export default Footer;
