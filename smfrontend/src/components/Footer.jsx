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
        <Link to='https://www.linkedin.com/in/fernando-chiesa/'>
          <p className="hover:font-semibold">Proyecto hecho por Firthunandz</p>
        </Link>
      </footer>
    </>
  );
};

export default Footer;