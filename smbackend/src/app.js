const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173'
  }));
app.use(express.json());

// Rutas
const timelineRouter = require('./routes/timeline.routes');
const authRouter = require('./routes/auth.routes');

app.get('/', (req, res) => {
    res.send('¡Servidor de Sophomap funcionando!');
});

app.use('/sophosmap', timelineRouter);
app.use('/users', authRouter);

// Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});