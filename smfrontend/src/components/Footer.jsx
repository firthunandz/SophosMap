import { Link } from "react-router-dom";

const Footer = () => {

  return (
    <>
      <footer className="bg-parchment">
        <Link to='https://www.linkedin.com/in/fernando-chiesa/'>
          <p className="text-end py-1 pr-20 hover:font-semibold">Proyecto hecho por Firthunandz</p>
        </Link>
      </footer>
    </>
  );
};

export default Footer;