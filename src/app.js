import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express();


//middlware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//routes
app.use('/auth', authRoutes);

export default app;
