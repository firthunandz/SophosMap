import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';
import { FiPlusCircle, FiArrowLeft } from 'react-icons/fi';

const NewPhilosopher = () => {
  const navigate = useNavigate();
  const [philosopher, setPhilosopher] = useState({
    nombre: '',
    fecha_nacimiento: '',
    fecha_texto: '',
    lugar_nacimiento: '',
    fecha_muerte: '',
    lugar_muerte: '',
    era: '', // FK
    escuela: '', // FK
    religion: '', // FK
    notas: '',
    legado: [], // Array de legado
    ocupacion: [], // Array de ocupaciones
    intereses: [], // Array de intereses
    conceptos: [], // Array de conceptos principales
    influencias: [], // Array de influencias
    estudiantes: [], // Array de estudiantes
    maestros: [], // Array de maestros
    works: [], // Array de trabajos
    books: [], // Array de libros
    quotes: [] // Array de citas
  });
  const [eras, setEras] = useState([]);
  const [religions, setReligions] = useState([]);
  const [schools, setSchools] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [erasData, religionsData, schoolsData] = await Promise.all([
          api.get('/eras'),
          api.get('/religions'),
          api.get('/schools'),
        ]);
        setEras(erasData.data);
        setReligions(religionsData.data);
        setSchools(schoolsData.data);
      } catch (error) {
        console.error("Error fetching related data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPhilosopher({
      ...philosopher,
      [name]: value,
    });
  };

  const handleAddField = (field) => {
    setPhilosopher({
      ...philosopher,
      [field]: [...philosopher[field], ''],
    });
  };

  const handleRemoveField = (field, index) => {
    const updatedField = philosopher[field].filter((_, i) => i !== index);
    setPhilosopher({
      ...philosopher,
      [field]: updatedField,
    });
  };

  const handleArrayChange = (field, index, value) => {
    const updatedField = [...philosopher[field]];
    updatedField[index] = value;
    setPhilosopher({
      ...philosopher,
      [field]: updatedField,
    });
  };
  
  const handleAddBook = () => {
    setPhilosopher({
      ...philosopher,
      books: [...philosopher.books, { titulo: '', idioma: '', estado: '', descripcion: '' }]
    });
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
  setPhilosopher({
    ...philosopher,
    works: [...philosopher.works, { titulo: '', descripcion: '' }]
  });
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
    setPhilosopher({
      ...philosopher,
      quotes: [...philosopher.quotes, '']
    });
  };

  const handleRemoveWork = (index) => {
    const updatedWorks = philosopher.works.filter((_, i) => i !== index);
    setPhilosopher({
      ...philosopher,
      works: updatedWorks,
    });
  };

  const handleRemoveBook = (index) => {
    const updatedBooks = philosopher.books.filter((_, i) => i !== index);
    setPhilosopher({
      ...philosopher,
      books: updatedBooks,
    });
  };

  const handleRemoveQuote = (index) => {
    const updatedQuotes = philosopher.quotes.filter((_, i) => i !== index);
    setPhilosopher({
      ...philosopher,
      quotes: updatedQuotes,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/philosophers', philosopher);
      setSuccessMessage('Filósofo creado exitosamente');
      setTimeout(() => {
        navigate('/admin/philosophers');
      }, 1250);
    } catch (err) {
      console.error('Error al crear filósofo:', err);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6">
      <div className="mb-4">
        <Button variant="gray" onClick={() => navigate('/admin/philosophers')}>
          <FiArrowLeft className="inline-block mr-1" />
          Volver
        </Button>
      </div>

      <h1 className="text-center font-cinzel text-ink-black text-2xl sm:text-3xl lg:text-4xl mb-4">
        Nuevo Filósofo
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Información básica */}
        <div className="flex flex-col sm:mb-4">
          <div className='mb-2'>
            <label className="block mb-1 text-base sm:text-lg font-semibold">Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={philosopher.nombre}
              onChange={handleInputChange}
              className="w-full p-2 border border-warm-gray rounded"
              required
            />
          </div>
          <div className='mb-2'>
            <label className="block mb-1 text-base sm:text-lg font-semibold">Fecha de nacimiento (date)</label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={philosopher.fecha_nacimiento}
              onChange={handleInputChange}
              className="w-full p-2 border border-warm-gray rounded"
            />
          </div>
          <div className='mb-2'>
            <label className="block mb-1 text-base sm:text-lg font-semibold">Fecha de nacimiento (texto)</label>
            <input
              type="text"
              name="fecha_texto"
              value={philosopher.fecha_texto}
              onChange={handleInputChange}
              className="w-full p-2 border border-warm-gray rounded"
              required
            />
          </div>
          <div className='mb-2'>
            <label className="block mb-1 text-base sm:text-lg font-semibold">Lugar de nacimiento</label>
            <input
              type="text"
              name="lugar_nacimiento"
              value={philosopher.lugar_nacimiento}
              onChange={handleInputChange}
              className="w-full p-2 border border-warm-gray rounded"
            />
          </div>
          <div className='mb-2'>
            <label className="block mb-1 text-base sm:text-lg font-semibold">Fecha de muerte</label>
            <input
              type="text"
              name="fecha_muerte"
              value={philosopher.fecha_muerte}
              onChange={handleInputChange}
              className="w-full p-2 border border-warm-gray rounded"
            />
          </div>
          <div className='mb-2'>
            <label className="block mb-1 text-base sm:text-lg font-semibold">Lugar de muerte</label>
            <input
              type="text"
              name="lugar_muerte"
              value={philosopher.lugar_muerte}
              onChange={handleInputChange}
              className="w-full p-2 border border-warm-gray rounded"
            />
          </div>
          <div className='mb-2'>
            <label className="block mb-1 text-base sm:text-lg font-semibold">Notas</label>
            <textarea
              name="notas"
              value={philosopher.notas}
              onChange={handleInputChange}
              className="w-full p-2 border border-warm-gray rounded"
              rows="4"
            />
          </div>
        </div>

        {/* Relaciones (FK) */}
        <div className="flex flex-col gap-y-2 justify-around mb-4 sm:flex-row sm:gap-x-2 sm:px-4">
          <div>
            <label className="block sm:mb-2">Era</label>
            <select
              name="era"
              value={philosopher.era}
              onChange={handleInputChange}
              className="w-full p-2 border border-warm-gray rounded text-sm sm:text-base"
              required
            >
              <option value="">Seleccionar era</option>
              {eras.map((era) => (
                <option key={era.id} value={era.id}>{era.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block sm:mb-2">Escuela</label>
            <select
              name="escuela"
              value={philosopher.escuela}
              onChange={handleInputChange}
              className="w-full p-2 border border-warm-gray rounded text-sm sm:text-base"
              required
            >
              <option value="">Seleccionar escuela</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>{school.nombre}</option>
              ))}
            </select>
          </div>
          <div className="sm:mb-4">
            <label className="block sm:mb-2">Religión</label>
            <select
              name="religion"
              value={philosopher.religion}
              onChange={handleInputChange}
              className="w-full p-2 border border-warm-gray rounded text-sm sm:text-base"
              required
            >
              <option value="">Seleccionar religión</option>
              {religions.map((religion) => (
                <option key={religion.id} value={religion.id}>{religion.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 sm:gap-8">
          {/* Legado */}
          <div>
            <div className="flex items-center gap-x-6 mb-2">
              <h2 className="text-base sm:text-lg font-semibold">Legado</h2>
              <button
                type="button"
                onClick={() => handleAddField('legado')}
                className="text-xl sm:text-2xl text-green-600 hover:text-green-800"
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
                  className="flex-grow p-2 border border-warm-gray rounded"
                  placeholder="Escribe un legado"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField('legado', idx)}
                  className="text-red-500 hover:text-red-700"
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
                className="text-xl sm:text-2xl text-green-600 hover:text-green-800"
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
                  className="flex-grow p-2 border border-warm-gray rounded"
                  placeholder="Escribe una ocupación"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField('ocupacion', idx)}
                  className="text-red-500 hover:text-red-700"
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
                className="text-xl sm:text-2xl text-green-600 hover:text-green-800"
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
                  className="flex-grow p-2 border border-warm-gray rounded"
                  placeholder="Escribe un interés"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField('intereses', idx)}
                  className="text-red-500 hover:text-red-700"
                  title="Eliminar interés"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Conceptos principales */}
          <div>
            <div className="flex items-center gap-x-6 mb-2">
              <h2 className="text-base sm:text-lg font-semibold">Conceptos</h2>
              <button
                type="button"
                onClick={() => handleAddField('conceptos')}
                className="text-xl sm:text-2xl text-green-600 hover:text-green-800"
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
                  className="flex-grow p-2 border border-warm-gray rounded"
                  placeholder="Escribe un concepto"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField('conceptos', idx)}
                  className="text-red-500 hover:text-red-700"
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
                className="text-xl sm:text-2xl text-green-600 hover:text-green-800"
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
                  className="flex-grow p-2 border border-warm-gray rounded"
                  placeholder="Escribe una influencia"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField('influencias', idx)}
                  className="text-red-500 hover:text-red-700"
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
                className="text-xl sm:text-2xl text-green-600 hover:text-green-800"
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
                  className="flex-grow p-2 border border-warm-gray rounded"
                  placeholder="Escribe un estudiante"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField('estudiantes', idx)}
                  className="text-red-500 hover:text-red-700"
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
                className="text-xl sm:text-2xl text-green-600 hover:text-green-800"
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
                  className="flex-grow p-2 border border-warm-gray rounded"
                  placeholder="Escribe un maestro"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField('maestros', idx)}
                  className="text-red-500 hover:text-red-700"
                  title="Eliminar maestro"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-y-2 sm:gap-8 mt-2 sm:mt-8">
          {/* Libros */}
          <div>
            <div className="flex items-center gap-x-6 mb-2">
              <h2 className="text-base sm:text-lg font-semibold">Libros</h2>
              <button
                type="button"
                onClick={handleAddBook}
                className="text-xl sm:text-2xl text-green-600 hover:text-green-800"
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
                  className="w-full p-2 border border-warm-gray rounded mb-2 text-sm sm:text-base"
                />
                <input
                  type="text"
                  placeholder="Idioma"
                  value={book.idioma}
                  onChange={(e) => handleBookChange(idx, 'idioma', e.target.value)}
                  className="w-full p-2 border border-warm-gray rounded mb-2 text-sm sm:text-base"
                />
                <input
                  type="text"
                  placeholder="Estado"
                  value={book.estado}
                  onChange={(e) => handleBookChange(idx, 'estado', e.target.value)}
                  className="w-full p-2 border border-warm-gray rounded mb-2 text-sm sm:text-base"
                />
                <textarea
                  placeholder="Descripción"
                  value={book.descripcion}
                  onChange={(e) => handleBookChange(idx, 'descripcion', e.target.value)}
                  className="w-full p-2 border border-warm-gray rounded mb-2 text-sm sm:text-base"
                  rows="3"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveBook(idx)}
                  className="text-red-500 hover:text-red-700 sm:mt-1 text-sm sm:text-base"
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
                className="text-xl sm:text-2xl text-green-600 hover:text-green-800"
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
                  className="w-full p-2 border border-warm-gray rounded mb-2 text-sm sm:text-base"
                />
                <textarea
                  placeholder="Descripción"
                  value={work.descripcion}
                  onChange={(e) => handleWorkChange(idx, 'descripcion', e.target.value)}
                  className="w-full p-2 border border-warm-gray rounded mb-2 text-sm sm:text-base"
                  rows="3"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveWork(idx)}
                  className="text-red-500 hover:text-red-700 sm:mt-1 text-sm sm:text-base"
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
                  className="w-full p-2 border border-warm-gray rounded mb-2 text-sm sm:text-base"
                  rows="3"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveQuote(idx)}
                  className="text-red-500 hover:text-red-700 sm:mt-1 text-sm sm:text-base"
                >
                  Eliminar cita
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Guardar */}
        <div className="text-center mt-6">
          <Button type="submit" variant="gold">Guardar Filósofo</Button>
        </div>

        {successMessage && (
          <div className="mb-4 text-center text-green-700 font-medium">
            {successMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default NewPhilosopher;
