import { Link } from "react-router-dom";

const Footer = () => {

  return (
    <>
      <footer className="bg-parchment flex justify-between px-20 py-1 font-cinzel font-medium">
        <Link to={'/contact'}>
          <p className="hover:font-semibold">Contacto</p>
        </Link>
        <Link to='https://www.linkedin.com/in/fernando-chiesa/'>
          <p className="hover:font-semibold">Proyecto hecho por Firthunandz</p>
        </Link>
      </footer>
    </>
  );
};

export default Footer;