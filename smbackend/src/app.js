const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_ORIGIN || 'https://sophosmap.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    console.log('CORS Origin:', origin); // Log para depuración
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('CORS bloqueado para:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 204
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
});

const timelineRouter = require('./routes/timeline.routes');
const authRouter = require('./routes/auth.routes');
const favoritesRouter = require('./routes/user.routes');
const philosopherRouter = require('./routes/philosopher.routes');
const reviewsRouter = require('./routes/reviews.routes');
const erasRouter = require('./routes/eras.routes');
const schoolsRouter = require('./routes/schools.routes');
const religionsRouter = require('./routes/religions.routes');
const testRoutes = require('./routes/test.routes');

app.get('/', (req, res) => {
    res.send('¡Servidor de Sophomap funcionando!');
});

// app.get('/api/health', (req, res) => {
//   res.status(200).json({ ok: true });
// });

app.use('/sophosmap', timelineRouter);
app.use('/auth', authLimiter, authRouter);
app.use('/users', favoritesRouter);
app.use('/philosophers', philosopherRouter);
app.use('/reviews', reviewsRouter);
app.use('/eras', erasRouter);
app.use('/schools', schoolsRouter);
app.use('/religions', religionsRouter);
app.use('/api', testRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  if (err?.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS blocked' });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en ${PORT}`);
});