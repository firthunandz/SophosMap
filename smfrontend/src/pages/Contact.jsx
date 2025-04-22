import { useAuth } from '../context/authContext';
import Button from '../components/ui/Button';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import ContactForm from '../components/forms/ContactForm';

export const Contact = () => {
  const { user, isAuthenticated } = useAuth();
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 font-eb-garamond text-lg text-deep-sepia">
      <h2 className="text-4xl font-cinzel text-warm-brown font-bold mb-2 text-center">
        Contacto
      </h2>

      <p className="text-center mb-6">
        Si tenés alguna sugerencia, recomendación o simplemente querés dejar un mensaje, completá el formulario. ¡Te leo!
      </p>

      <div className="flex justify-center gap-4 mb-8">
        <a
          href="https://github.com/firthunandz"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="gold" size="sm" className="flex items-center">
            <FaGithub className="mr-2 size-5" />
            GitHub
          </Button>
        </a>
        <a
          href="https://linkedin.com/in/fernando-chiesa"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="brown" size="sm" className="flex items-center">
            <FaLinkedin className="mr-2 size-5" />
            LinkedIn
          </Button>
        </a>
      </div>

      {/* 👇 Este es el nuevo componente reutilizable */}
      <ContactForm isAuthenticated={isAuthenticated} user={user} />
    </div>
  );
};