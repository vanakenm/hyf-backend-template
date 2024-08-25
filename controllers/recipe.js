import query from '../config/db.js';

const RECIPES = [
    {
        id: 1,
        title: 'Pancakes',
        ingredients: 'flour, eggs, milk, sugar, salt',
        instructions: 'Mix all ingredients together and fry in a pan',
        time: 30,
        difficulty: 'easy'
    },
    {
        id: 2,
        title: 'Spaghetti Carbonara',
        ingredients: 'spaghetti, eggs, bacon, parmesan cheese, salt, pepper',
        instructions:
            'Boil spaghetti, fry bacon, mix eggs and cheese, combine all ingredients',
        time: 45,
        difficulty: 'medium'
    },
    {
        id: 3,
        title: 'Chicken Curry',
        ingredients:
            'chicken, curry paste, coconut milk, onion, garlic, ginger',
        instructions:
            'Fry chicken, add curry paste, add coconut milk, add onion, garlic, ginger',
        time: 60,
        difficulty: 'hard'
    }
];

const recipeControllers = {
    getAllRecipes: async (req, res) => {
        return RECIPES;
    }
};

export default recipeControllers;
