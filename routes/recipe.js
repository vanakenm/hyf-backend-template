import express from 'express';
import recipeControllers from '../controllers/recipe.js';

const router = express.Router();

router.get('/recipes', async function (req, res, next) {
    res.json(await recipeControllers.getAllRecipes());
});

export default router;
