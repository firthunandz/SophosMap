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
const favoritesRouter = require('./routes/user.routes');
const philosopherRouter = require('./routes/philosopher.routes');


app.get('/', (req, res) => {
    res.send('¡Servidor de Sophomap funcionando!');
});

app.use('/sophosmap', timelineRouter);
app.use('/auth', authRouter);
app.use('/users', favoritesRouter);
app.use('/philosophers', philosopherRouter);

// Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});