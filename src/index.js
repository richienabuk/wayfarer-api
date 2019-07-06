import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('*', (req, res) => res.status(200).send({ message: 'Welcome to WayFarer API' }));

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}!`));
