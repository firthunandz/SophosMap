const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});