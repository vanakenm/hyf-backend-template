import express from 'express';
import cookieParser from 'cookie-parser';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import createUserTable from './models/user.js';
import createRecipeTable from './models/recipe.js';

// import routes
import userRoutes from './routes/user.js';
import recipeRoutes from './routes/recipe.js';

// set port
const PORT = process.env.PORT || 5009;

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
createUserTable();
createRecipeTable();

// use routes
app.use(userRoutes);
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
