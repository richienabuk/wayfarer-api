import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
   

// require('./startup/routes')(app);
routes(app);

// app.get('*', (req, res) => res.status(200).send({ message: 'Welcome to WayFarer API' }));

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}!`));

export default app;
