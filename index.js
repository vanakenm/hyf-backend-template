import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';  //use cors
import offersRoutes from './routes/offers.js';
import reservationsRoutes from './routes/reservations.js';
import boxesRoutes from './routes/boxes.js';
import usersRoutes from './routes/user.js';

const app = express();
app.use(bodyParser.json());

// add CORS
app.use(cors());

app.use('/offers', offersRoutes);
app.use('/reservations', reservationsRoutes);
app.use('/user', usersRoutes);
app.use('/boxes', boxesRoutes);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
