import { useAuth } from '../context/authContext';
import Button from '../components/ui/Button';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import ContactForm from '../components/forms/ContactForm';

export const Contact = () => {
  const { user, isAuthenticated } = useAuth();
  return (
    <section className="sm:max-w-lg md:max-w-2xl mx-auto px-4 py-4 md:py-4 lg:py-8 font-eb-garamond text-lg text-deep-sepia flex flex-col gap-y-3 lg:gap-y-6">
      <h2 className="xs:text-xl md:text-4xl font-cinzel text-warm-brown font-bold text-center">
        Contacto
      </h2>

      <p className="text-center text-base md:text-xl">
        Si tenés alguna sugerencia, recomendación o simplemente querés dejar un mensaje, completá el formulario. ¡Te leo!
      </p>

      <div className="flex justify-center gap-4">
        <a
          href="https://github.com/firthunandz"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="gold" size="sm" className="flex items-center md:p-2">
            <FaGithub className="mr-2 size-5 md:size 7" />
            GitHub
          </Button>
        </a>
        <a
          href="https://linkedin.com/in/fernando-chiesa"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="brown" size="sm" className="flex items-center md:p-2">
            <FaLinkedin className="mr-2 size-5 md:size 7" />
            LinkedIn
          </Button>
        </a>
      </div>

      <ContactForm isAuthenticated={isAuthenticated} user={user} />
    </section>
  );
};