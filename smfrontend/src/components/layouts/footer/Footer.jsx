import { Link } from "react-router-dom";

const Footer = () => {

  return (
    <>
      <footer className="bg-parchment flex justify-between px-30 py-1 font-cinzel font-medium">
        <section className="flex gap-x-10">
          <Link to={'/contact'}>
            <p className="hover:font-semibold">Contacto</p>
          </Link>
          <Link to={'/reviews'}>
            <p className="hover:font-semibold">Reseñas</p>
          </Link>
        </section>
        <a 
          href="https://www.linkedin.com/in/fernando-chiesa/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <p className="hover:font-semibold">Proyecto hecho por Firthunandz</p>
        </a>
      </footer>
    </>
  );
};

export default Footer;