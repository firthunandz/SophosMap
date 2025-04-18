import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const ReviewsPage = ({ onReviewAdded }) => {
  const { user, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews');
        setReviews(res.data); // asumimos que la respuesta es un array
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
        ? { text } // si está logueado, el nombre se obtiene del backend con el user_id
        : { name, text }; // si no está logueado, mandamos el nombre

      await api.post('/reviews', payload);
      setText('');
      setName('');
      setSuccess(true);
      setError(null);
      if (onReviewAdded) onReviewAdded(); // para recargar las reviews
    } catch (err) {
      setError('Error al enviar la reseña.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col justify-between">
      <h1 className="text-2xl font-bold mb-4 text-center">Dejanos tu reseña</h1>
      <p className="text-center text-gray-700 mb-8">
        Gracias por visitar este proyecto. Si te gustó, te invito a dejar una reseña.
        Tus comentarios son muy valiosos para seguir creciendo y mejorando. ¡Gracias por formar parte!
      </p>

      <form 
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow-md max-w-md w-full mx-auto flex flex-col justify-center min-h-[300px]"
      >
        {!isAuthenticated && (
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Tu reseña</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            rows="4"
            required
          />
        </div>

        <button 
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Enviar
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Reseñas recibidas</h2>
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500">Aún no hay reseñas. Sé el primero en dejar una!</p>
        ) : (
          reviews.map((review, i) => (
            <div key={i} className="bg-gray-100 p-4 rounded shadow">
              <p className="text-gray-800 italic">"{review.text}"</p>
              <div className="mt-2 text-sm text-gray-600 flex justify-between">
                <span>- {review.name}</span>
                <span>{review.date}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
