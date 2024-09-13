import express from 'express';
import cookieParser from 'cookie-parser';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// import routes
import recipeRoutes from './routes/recipe.js';

// set port
const PORT = process.env.PORT || 5000;

// Construct path
const __filename = fileURLToPath(import.meta.url);
const PATH = dirname(__filename);

// initialize express
const app = express();

// parse body and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(PATH, 'public')));

// create tables
// createUserTable();
// createRecipeTable();

// use routes
// app.use(userRoutes);

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.use(recipeRoutes);

// error
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
});

// handle 404
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Page is not found' });
});

// listen
app.listen(PORT, () => {
    console.log(`Server is up and running on port : ${PORT}`);
});
