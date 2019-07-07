import dotenv from 'dotenv';
import express from 'express';
import routes from './routes';

dotenv.config();
const app = express();
routes(app);

// app.get('*', (req, res) => res.status(200).send({ message: 'Welcome to WayFarer API' }));

// eslint-disable-next-line no-console
app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}!`));

export default app;
