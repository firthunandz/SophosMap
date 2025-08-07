import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';
import { FiPlusCircle, FiArrowLeft } from 'react-icons/fi';

const PhilosopherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [philosopher, setPhilosopher] = useState({
    nombre: '',
    fecha_nacimiento: '',
    fecha_texto: '',
    lugar_nacimiento: '',
    fecha_muerte: '',
    lugar_muerte: '',
    era: '',
    escuela: '',
    religion: '',
    notas: '',
    legado: [],
    ocupacion: [],
    intereses: [],
    conceptos: [],
    influencias: [],
    estudiantes: [],
    maestros: [],
    works: [],
    books: [],
    quotes: [],
    image_url: ''
  });
  const [eras, setEras] = useState([]);
  const [religions, setReligions] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const [erasRes, religionsRes, schoolsRes] = await Promise.all([
          api.get('/eras'),
          api.get('/religions'),
          api.get('/schools')
        ]);
        setEras(erasRes.data);
        setReligions(religionsRes.data);
        setSchools(schoolsRes.data);
      } catch (err) {
        console.error('Error fetching related data:', err);
      }
    };

    const fetchPhilosopher = async () => {
      try {
        const { data } = await api.get(`/philosophers/${id}`);
        const rawDate = data.fecha_nacimiento || '';
        const dateOnly = rawDate.includes('T') ? rawDate.split('T')[0] : rawDate;

        setPhilosopher({
          nombre: data.nombre || '',
          fecha_nacimiento: dateOnly || '',
          fecha_texto: data.fecha_texto || '',
          lugar_nacimiento: data.lugar_nacimiento || '',
          fecha_muerte: data.fecha_muerte || '',
          lugar_muerte: data.lugar_muerte || '',
          era: data.era_id ?? '',
          escuela: data.escuela_id ?? '',
          religion: data.religion_id ?? '',
          notas: data.notas || '',
          legado: Array.isArray(data.legado) ? data.legado : [],
          ocupacion: Array.isArray(data.ocupacion) ? data.ocupacion : [],
          intereses: Array.isArray(data.intereses) ? data.intereses : [],
          conceptos: Array.isArray(data.conceptos) ? data.conceptos : [],
          influencias: Array.isArray(data.influencias) ? data.influencias : [],
          estudiantes: Array.isArray(data.estudiantes) ? data.estudiantes : [],
          maestros: Array.isArray(data.maestros) ? data.maestros : [],
          works: Array.isArray(data.works) ? data.works : [],
          books: Array.isArray(data.books) ? data.books : [],
          quotes: Array.isArray(data.quotes) ? data.quotes : [],
          image_url: data.image_url || ''
        });
      } catch (err) {
        console.error('Error fetching philosopher:', err);
      } finally {
        setLoading(false);
      }
    };

    Promise.all([fetchRelated(), fetchPhilosopher()]);
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPhilosopher((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddField = (field) => {
    setPhilosopher((prev) => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handleRemoveField = (field, index) => {
    setPhilosopher((prev) => {
      const updated = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: updated };
    });
  };

  const handleArrayChange = (field, index, value) => {
    setPhilosopher((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const handleAddBook = () => {
    setPhilosopher((prev) => ({
      ...prev,
      books: [...prev.books, { titulo: '', idioma: '', estado: '', descripcion: '' }]
    }));
  };

  const handleBookChange = (index, clave, value) => {
    const updated = [...philosopher.books];
    updated[index] = { 
      ...updated[index], 
      [clave]: value 
    };
    setPhilosopher({
      ...philosopher,
      books: updated
    });
  };

  const handleAddWork = () => {
    setPhilosopher((prev) => ({
      ...prev,
      works: [...prev.works, { titulo: '', descripcion: '' }]
    }));
  };

  const handleWorkChange = (index, clave, value) => {
    const updated = [...philosopher.works];
    updated[index] = { 
      ...updated[index],
      [clave]: value 
    };
    setPhilosopher({
      ...philosopher,
      works: updated
    });
  };

  const handleAddQuote = () => {
    setPhilosopher((prev) => ({
      ...prev,
      quotes: [...prev.quotes, '']
    }));
  };

  const handleRemoveBook = (index) => {
    setPhilosopher((prev) => {
      const updated = prev.books.filter((_, i) => i !== index);
      return { ...prev, books: updated };
    });
  };

  const handleRemoveWork = (index) => {
    setPhilosopher((prev) => {
      const updated = prev.works.filter((_, i) => i !== index);
      return { ...prev, works: updated };
    });
  };

  const handleRemoveQuote = (index) => {
    setPhilosopher((prev) => {
      const updated = prev.quotes.filter((_, i) => i !== index);
      return { ...prev, quotes: updated };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      await api.put(`/philosophers/${id}`, {
        nombre: philosopher.nombre,
        fecha_nacimiento: philosopher.fecha_nacimiento,
        fecha_texto: philosopher.fecha_texto,
        lugar_nacimiento: philosopher.lugar_nacimiento,
        fecha_muerte: philosopher.fecha_muerte,
        lugar_muerte: philosopher.lugar_muerte,
        era: philosopher.era,
        escuela: philosopher.escuela,
        religion: philosopher.religion,
        notas: philosopher.notas,
        legado: philosopher.legado,
        ocupacion: philosopher.ocupacion,
        intereses: philosopher.intereses,
        conceptos: philosopher.conceptos,
        influencias: philosopher.influencias,
        estudiantes: philosopher.estudiantes,
        maestros: philosopher.maestros,
        works: philosopher.works,
        books: philosopher.books,
        quotes: philosopher.quotes,
        image_url: philosopher.image_url
      });
      setSuccessMessage('Cambios guardados exitosamente');
      setTimeout(() => {
        navigate('/admin/philosophers');
      }, 1250);
    } catch (err) {
      console.error('Error al actualizar filósofo:', err);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este filósofo?');
    if (!confirmed) return;
    try {
      await api.delete(`/philosophers/${id}`);
      navigate('/admin/philosophers');
    } catch (err) {
      console.error('Error al eliminar filósofo:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-4 sm:py-6 sm:px-12">
      {/* Volver arriba */}
      <div className="mb-4">
        <Button variant="gray" onClick={() => navigate('/admin/philosophers')}>
          <FiArrowLeft className="inline-block mr-1" />
          Volver
        </Button>
      </div>

      <h1 className="text-center font-cinzel text-ink-black mb-1 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl">
        Editar Filósofo
      </h1>

      {successMessage && (
        <div className="mb-4 text-center text-green-700 font-medium text-sm sm:text-base">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Información básica */}
        <div className="flex flex-col gap-x-16 mb-4">
          <div className="mb-2">
            <label className="block mb-1 font-semibold text-base sm:text-lg">Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={philosopher.nombre}
              onChange={handleInputChange}
              className="w-full p-2 border border-warm-gray rounded text-sm sm:text-lg"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-semibold text-base sm:text-lg">Fecha de nacimiento</label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={philosopher.fecha_nacimiento}
              onChange={handleInputChange}
              className="w-full p-2 border border-warm-gray rounded text-sm sm:text-lg"
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-semibold text-base sm:text-lg">Fecha (texto libre)</label>
            <input
              type="text"
              name="fecha_texto"
              value={philosopher.fecha_texto}
              onChange={handleInputChange}
              className="w-full p-2 border border-warm-gray rounded text-sm sm:text-lg"
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-semibold text-base sm:text-lg">Lugar de nacimiento</label>
            <input
              type="text"
              name="lugar_nacimiento"
              value={philosopher.lugar_nacimiento}
              onChange={handleInputChange}
              className="w-full p-2 border border-warm-gray rounded text-sm sm:text-lg"
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-semibold text-base sm:text-lg">Fecha de muerte (texto)</label>
            <input
              type="text"
              name="fecha_muerte"
              value={philosopher.fecha_muerte}
              onChange={handleInputChange}
              className="w-full p-2 border border-warm-gray rounded text-sm sm:text-lg"
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-semibold text-base sm:text-lg">Lugar de muerte</label>
            <input
              type="text"
              name="lugar_muerte"
              value={philosopher.lugar_muerte}
              onChange={handleInputChange}
              className="w-full p-2 border border-warm-gray rounded text-sm sm:text-lg"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-base sm:text-lg">Notas</label>
            <textarea
              name="notas"
              value={philosopher.notas}
              onChange={handleInputChange}
              className="w-full p-2 border border-warm-gray rounded text-sm sm:text-lg"
              rows="4"
            />
          </div>
        </div>

        {/* Relaciones (FK) */}
        <div className="flex justify-around mb-4 flex-col gap-y-2 sm:flex-row sm:gap-y-0 sm:gap-x-4 sm:px-4">
          <div>
            <label className="block font-semibold text-base sm:text-lg">Era</label>
            <select
              name="era"
              value={philosopher.era}
              onChange={handleInputChange}
              className="w-full p-2 border border-warm-gray rounded text-sm sm:text-lg"
              required
            >
              <option value="">Seleccionar era</option>
              {eras.map((era) => (
                <option key={era.id} value={era.id}>{era.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-base sm:text-lg">Escuela</label>
            <select
              name="escuela"
              value={philosopher.escuela}
              onChange={handleInputChange}
              className="w-full p-2 border border-warm-gray rounded text-sm sm:text-lg"
              required
            >
              <option value="">Seleccionar escuela</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>{school.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-base sm:text-lg">Religión</label>
            <select
              name="religion"
              value={philosopher.religion}
              onChange={handleInputChange}
              className="w-full p-2 border border-warm-gray rounded text-sm sm:text-lg"
              required
            >
              <option value="">Seleccionar religión</option>
              {religions.map((religion) => (
                <option key={religion.id} value={religion.id}>{religion.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Campos dinámicos en dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
          {/* Legado */}
          <div>
            <div className="flex items-center gap-x-6 mb-2">
              <h2 className="text-base sm:text-lg font-semibold">Legado</h2>
              <button
                type="button"
                onClick={() => handleAddField('legado')}
                className="text-2xl text-green-600 hover:text-green-800"
                title="Agregar legado"
              >
                <FiPlusCircle />
              </button>
            </div>
            {philosopher.legado.map((item, idx) => (
              <div key={idx} className="flex items-center mb-2 gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('legado', idx, e.target.value)}
                  className="flex-grow p-2 border border-warm-gray rounded text-sm sm:text-lg"
                  placeholder="Escribe un legado"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField('legado', idx)}
                  className="text-red-500 hover:text-red-700 text-sm sm:text-lg"
                  title="Eliminar legado"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Ocupación */}
          <div>
            <div className="flex items-center gap-x-6 mb-2">
              <h2 className="text-base sm:text-lg font-semibold">Ocupación</h2>
              <button
                type="button"
                onClick={() => handleAddField('ocupacion')}
                className="text-2xl text-green-600 hover:text-green-800"
                title="Agregar ocupación"
              >
                <FiPlusCircle />
              </button>
            </div>
            {philosopher.ocupacion.map((item, idx) => (
              <div key={idx} className="flex items-center mb-2 gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('ocupacion', idx, e.target.value)}
                  className="flex-grow p-2 border border-warm-gray rounded text-sm sm:text-lg"
                  placeholder="Escribe una ocupación"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField('ocupacion', idx)}
                  className="text-red-500 hover:text-red-700 text-sm sm:text-lg"
                  title="Eliminar ocupación"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Intereses */}
          <div>
            <div className="flex items-center gap-x-6 mb-2">
              <h2 className="text-base sm:text-lg font-semibold">Intereses</h2>
              <button
                type="button"
                onClick={() => handleAddField('intereses')}
                className="text-2xl text-green-600 hover:text-green-800"
                title="Agregar interés"
              >
                <FiPlusCircle />
              </button>
            </div>
            {philosopher.intereses.map((item, idx) => (
              <div key={idx} className="flex items-center mb-2 gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('intereses', idx, e.target.value)}
                  className="flex-grow p-2 border border-warm-gray rounded text-sm sm:text-lg"
                  placeholder="Escribe un interés"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField('intereses', idx)}
                  className="text-red-500 hover:text-red-700 text-sm sm:text-lg"
                  title="Eliminar interés"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Conceptos */}
          <div>
            <div className="flex items-center gap-x-6 mb-2">
              <h2 className="text-base sm:text-lg font-semibold">Conceptos</h2>
              <button
                type="button"
                onClick={() => handleAddField('conceptos')}
                className="text-2xl text-green-600 hover:text-green-800"
                title="Agregar concepto"
              >
                <FiPlusCircle />
              </button>
            </div>
            {philosopher.conceptos.map((item, idx) => (
              <div key={idx} className="flex items-center mb-2 gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('conceptos', idx, e.target.value)}
                  className="flex-grow p-2 border border-warm-gray rounded text-sm sm:text-lg"
                  placeholder="Escribe un concepto"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField('conceptos', idx)}
                  className="text-red-500 hover:text-red-700 text-sm sm:text-lg"
                  title="Eliminar concepto"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Influencias */}
          <div>
            <div className="flex items-center gap-x-6 mb-2">
              <h2 className="text-base sm:text-lg font-semibold">Influencias</h2>
              <button
                type="button"
                onClick={() => handleAddField('influencias')}
                className="text-2xl text-green-600 hover:text-green-800"
                title="Agregar influencia"
              >
                <FiPlusCircle />
              </button>
            </div>
            {philosopher.influencias.map((item, idx) => (
              <div key={idx} className="flex items-center mb-2 gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('influencias', idx, e.target.value)}
                  className="flex-grow p-2 border border-warm-gray rounded text-sm sm:text-lg"
                  placeholder="Escribe una influencia"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField('influencias', idx)}
                  className="text-red-500 hover:text-red-700 text-sm sm:text-lg"
                  title="Eliminar influencia"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Estudiantes */}
          <div>
            <div className="flex items-center gap-x-6 mb-2">
              <h2 className="text-base sm:text-lg font-semibold">Estudiantes</h2>
              <button
                type="button"
                onClick={() => handleAddField('estudiantes')}
                className="text-2xl text-green-600 hover:text-green-800"
                title="Agregar estudiante"
              >
                <FiPlusCircle />
              </button>
            </div>
            {philosopher.estudiantes.map((item, idx) => (
              <div key={idx} className="flex items-center mb-2 gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('estudiantes', idx, e.target.value)}
                  className="flex-grow p-2 border border-warm-gray rounded text-sm sm:text-lg"
                  placeholder="Escribe un estudiante"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField('estudiantes', idx)}
                  className="text-red-500 hover:text-red-700 text-sm sm:text-lg"
                  title="Eliminar estudiante"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Maestros */}
          <div>
            <div className="flex items-center gap-x-6 mb-2">
              <h2 className="text-base sm:text-lg font-semibold">Maestros</h2>
              <button
                type="button"
                onClick={() => handleAddField('maestros')}
                className="text-2xl text-green-600 hover:text-green-800"
                title="Agregar maestro"
              >
                <FiPlusCircle />
              </button>
            </div>
            {philosopher.maestros.map((item, idx) => (
              <div key={idx} className="flex items-center mb-2 gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('maestros', idx, e.target.value)}
                  className="flex-grow p-2 border border-warm-gray rounded text-sm sm:text-lg"
                  placeholder="Escribe un maestro"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField('maestros', idx)}
                  className="text-red-500 hover:text-red-700 text-sm sm:text-lg"
                  title="Eliminar maestro"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Libros, Trabajos y Citas */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 mt-2 md:mt-8">
          {/* Libros */}
          <div>
            <div className="flex items-center gap-x-6 mb-2">
              <h2 className="text-base sm:text-lg font-semibold">Libros</h2>
              <button
                type="button"
                onClick={handleAddBook}
                className="text-2xl text-green-600 hover:text-green-800"
                title="Agregar libro"
              >
                <FiPlusCircle />
              </button>
            </div>
            {philosopher.books.map((book, idx) => (
              <div key={idx} className="border-b border-warm-gray pb-4 mb-4">
                <input
                  type="text"
                  placeholder="Título del libro"
                  value={book.titulo}
                  onChange={(e) => handleBookChange(idx, 'titulo', e.target.value)}
                  className="w-full p-2 border border-warm-gray rounded mb-2 text-sm sm:text-lg"
                />
                <input
                  type="text"
                  placeholder="Idioma"
                  value={book.idioma}
                  onChange={(e) => handleBookChange(idx, 'idioma', e.target.value)}
                  className="w-full p-2 border border-warm-gray rounded mb-2 text-sm sm:text-lg"
                />
                <input
                  type="text"
                  placeholder="Estado"
                  value={book.estado}
                  onChange={(e) => handleBookChange(idx, 'estado', e.target.value)}
                  className="w-full p-2 border border-warm-gray rounded mb-2 text-sm sm:text-lg"
                />
                <textarea
                  placeholder="Descripción"
                  value={book.descripcion}
                  onChange={(e) => handleBookChange(idx, 'descripcion', e.target.value)}
                  className="w-full p-2 border border-warm-gray rounded mb-2 text-sm sm:text-lg"
                  rows="3"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveBook(idx)}
                  className="text-red-500 hover:text-red-700 mt-1 text-sm sm:text-lg"
                >
                  Eliminar libro
                </button>
              </div>
            ))}
          </div>

          {/* Trabajos */}
          <div>
            <div className="flex items-center gap-x-6 mb-2">
              <h2 className="text-base sm:text-lg font-semibold">Trabajos</h2>
              <button
                type="button"
                onClick={handleAddWork}
                className="text-2xl text-green-600 hover:text-green-800"
                title="Agregar trabajo"
              >
                <FiPlusCircle />
              </button>
            </div>
            {philosopher.works.map((work, idx) => (
              <div key={idx} className="border-b border-warm-gray pb-4 mb-4">
                <input
                  type="text"
                  placeholder="Título del trabajo"
                  value={work.titulo}
                  onChange={(e) => handleWorkChange(idx, 'titulo', e.target.value)}
                  className="w-full p-2 border border-warm-gray rounded mb-2 text-sm sm:text-lg"
                />
                <textarea
                  placeholder="Descripción"
                  value={work.descripcion}
                  onChange={(e) => handleWorkChange(idx, 'descripcion', e.target.value)}
                  className="w-full p-2 border border-warm-gray rounded mb-2 text-sm sm:text-lg"
                  rows="3"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveWork(idx)}
                  className="text-red-500 hover:text-red-700 mt-1 text-sm sm:text-lg"
                >
                  Eliminar trabajo
                </button>
              </div>
            ))}
          </div>

          {/* Citas */}
          <div>
            <div className="flex items-center gap-x-6 mb-2">
              <h2 className="text-base sm:text-lg font-semibold">Citas</h2>
              <button
                type="button"
                onClick={handleAddQuote}
                className="text-xl sm:text-2xl text-green-600 hover:text-green-800"
                title="Agregar cita"
              >
                <FiPlusCircle />
              </button>
            </div>
            {philosopher.quotes.map((quote, idx) => (
              <div key={idx} className="border-b border-warm-gray pb-4 mb-4">
                <textarea
                  placeholder="Escribe una cita"
                  value={quote}
                  onChange={(e) => handleArrayChange('quotes', idx, e.target.value)}
                  className="w-full p-2 border border-warm-gray rounded mb-2 text-sm sm:text-lg"
                  rows="3"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveQuote(idx)}
                  className="text-red-500 hover:text-red-700 mt-1 text-sm sm:text-lg"
                >
                  Eliminar cita
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-base sm:text-lg font-semibold">URL de la imagen</label>
          <input
            type="url"
            name="image_url"
            value={philosopher.image_url}
            onChange={handleInputChange}
            placeholder="https://…"
            className="w-full p-2 border border-warm-gray rounded"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex justify-center my-2 sm:my-6">
          <div className="flex gap-2 sm:gap-4">
            <Button variant="gray" onClick={() => navigate('/admin/philosophers')} className='text-xs sm:text-base'>
              <FiArrowLeft className="inline-block mr-1 text-xs sm:text-base" />
              Volver
            </Button>
            <Button type="submit" variant="gold" className='text-xs sm:text-base'>
              Guardar cambios
            </Button>
            <Button type="button" variant="brown" onClick={handleDelete} className='text-xs sm:text-base'>
              Eliminar Filósofo
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PhilosopherDetail;