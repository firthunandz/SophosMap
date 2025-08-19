const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');


const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({
    origin: FRONTEND_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const timelineRouter = require('./routes/timeline.routes');
const authRouter = require('./routes/auth.routes');
const favoritesRouter = require('./routes/user.routes');
const philosopherRouter = require('./routes/philosopher.routes');
const reviewsRouter = require('./routes/reviews.routes');
const erasRouter = require('./routes/eras.routes');
const schoolsRouter = require('./routes/schools.routes');
const religionsRouter = require('./routes/religions.routes');

app.get('/', (req, res) => {
    res.send('¡Servidor de Sophomap funcionando!');
});

app.use('/sophosmap', timelineRouter);
app.use('/auth', authRouter);
app.use('/users', favoritesRouter);
app.use('/philosophers', philosopherRouter);
app.use('/reviews', reviewsRouter);
app.use('/eras', erasRouter);
app.use('/schools', schoolsRouter);
app.use('/religions', religionsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});