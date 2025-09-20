import 'dotenv/config';
import express from 'express';
import { userRoutes } from './routes/userRoutes.js';
import { authRoutes } from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', authRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
