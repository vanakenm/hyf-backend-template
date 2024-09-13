import express from 'express';
import bodyParser from 'body-parser';
import offersRoutes from './routes/offers.js';
import reservationsRoutes from './routes/reservations.js';
import boxesRoutes from './routes/boxes.js';

const app = express();
app.use(bodyParser.json());

app.use('/offers', offersRoutes);
app.use('/reservations', reservationsRoutes);
app.use('/boxes', boxesRoutes);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
