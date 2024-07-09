import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Importing routes
import clientRoutes from './routes/client.routes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/clients', clientRoutes);

export default app;