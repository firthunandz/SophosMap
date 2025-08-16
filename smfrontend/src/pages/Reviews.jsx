import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/authContext';
import ModalReviewForm from '../components/modals/ModalReviewForm';
import Button from '../components/ui/Button';

const ReviewsPage = ({ onReviewAdded }) => {
  const { user, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews');
        setReviews(res.data);
      } catch (err) {
        console.error('Error al obtener las reseñas', err);
      }
    };

    fetchReviews();
  }, [onReviewAdded, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError('El texto no puede estar vacío.');
      return;
    }

    try {
      const payload = isAuthenticated
        ? { text }
        : { name, text };

      await api.post('/reviews', payload);
      setText('');
      setName('');
      setSuccess(true);
      setError(null);
      setShowModal(false);
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      setError('Error al enviar la reseña.');
      console.error(err);
    }
  };

  return (
    <div className="mx-auto px-4 py-6 md:py-10 flex flex-col items-center gap-y-6 md:gap-y-12 font-eb-garamond">
      
      <section className="text-center max-w-sm lg:max-w-3xl flex flex-col gap-y-4">
        <h1 className="xs:text-2xl text-4xl font-bold font-cinzel text-warm-brown">
          Dejanos tu reseña
        </h1>
        <p className="text-deep-sepia text-lg">
          Gracias por visitar este proyecto. Si te gustó, te invito a dejar una reseña.
          Tus comentarios son muy valiosos para seguir creciendo y mejorando.
        </p>
        <Button onClick={() => setShowModal(true)} variant="gold" className='self-center'>
          Escribir reseña
        </Button>
      </section>

      <section className="w-full">
        <div className="relative flex items-center mb-6">
          <div className="flex-grow border-t border-warm-gray"></div>
          <span className="mx-4 text-warm-brown font-semibold text-xl">Reseñas</span>
          <div className="flex-grow border-t border-warm-gray"></div>
        </div>

        <div className="space-y-6">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-parchment/50 border border-warm-gray rounded-lg shadow-md p-4"
            >
              <p className="text-deep-sepia italic mb-2">"{review.text}"</p>
              <div className="text-sm text-warm-brown flex justify-between">
                <span>- {review.name}</span>
                <span>{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ModalReviewForm 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        isAuthenticated={isAuthenticated}
        name={name}
        setName={setName}
        text={text}
        setText={setText}
        error={error}
      />

    </div>
  );
};

export default ReviewsPage;