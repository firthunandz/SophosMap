const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const app = express();

// Middleware
app.use(cors());           // Permite peticiones desde otros dominios (útil para frontend)
app.use(express.json());   // Parsea los cuerpos de las peticiones en formato JSON

// Rutas (las definiremos más adelante)
const mapRouter = require('./src/routes/map.routes');
const usersRouter = require('./src/routes/auth.routes');

app.get('/', (req, res) => {
    res.send('¡Servidor de Sophomap funcionando!');
});

app.use('/sophomap', mapRouter);
app.use('/users', usersRouter);

// Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});