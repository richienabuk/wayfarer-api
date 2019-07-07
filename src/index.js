import dotenv from 'dotenv';
import express from 'express';
import routes from './routes';

dotenv.config();
const app = express();
routes(app);

// eslint-disable-next-line no-console
app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}!`));

export default app;
