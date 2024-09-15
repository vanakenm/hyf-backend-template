import express from 'express';
// import userControllers from '../controllers/user.js';
import query from '../config/db.js';

const router = express.Router();

// Добавление нового пользователя
router.post('/', async (req, res) => {
    const { name, email, phone, password, preferences } = req.body;

    try {
        const sql = `
            INSERT INTO users (name, email, phone, password, preferences)
            VALUES (?, ?, ?, ?, ?)
        `;
        await query(sql, [name, email, phone, password, preferences]);

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

// Добавление нового провайдера (магазина)
router.post('/', async (req, res) => {
    const { name, login, password, email, phone, address, coordinates, description } = req.body;

    try {
        const sql = `
            INSERT INTO providers (name, login, password, email, phone, address, coordinates, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await query(sql, [name, login, password, email, phone, address, coordinates, description]);

        res.status(201).json({ message: 'The store has been successfully created.' });
    } catch (err) {
        res.status(500).json({ error: 'Error creating store' });
    }
});



export default router;
