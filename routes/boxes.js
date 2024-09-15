import express from 'express';
import query from '../config/db.js';

const router = express.Router();

// Добавление количества боксов определенного типа на определенную дату
router.put('/add-boxes', async (req, res) => {
    const { provider_id, week_start, type, quantity } = req.body;

    let column;
    switch (type) {
        case 'standard':
            column = 'standard_quantity';
            break;
        case 'vegan':
            column = 'vegan_quantity';
            break;
        case 'diabetic':
            column = 'diabetic_quantity';
            break;
        default:
            return res.status(400).json({ error: 'Invalid box type' });
    }

    try {
        const sql = `
            UPDATE weekly_plans
            SET ${column} = ${column} + ?
            WHERE provider_id = ? AND week_start = ?
        `;
        const result = await query(sql, [quantity, provider_id, week_start]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Plan not found for the given provider and date' });
        }

        res.json({ message: 'Box quantity updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error updating box quantity' });
    }
});

// Изменение описания коробки определенного типа
router.put('/update-description', async (req, res) => {
    const { provider_id, type, description } = req.body;

    try {
        const sql = `
            UPDATE boxes
            SET description = ?
            WHERE provider_id = ? AND type = ?
        `;
        const result = await query(sql, [description, provider_id, type]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Box not found for the given provider and type' });
        }

        res.json({ message: 'Box description updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error updating box description' });
    }
});


// Получение коробок по магазину и дате
router.get('/', async (req, res) => {
    const { provider_id, startDate, endDate } = req.query;

    try {
        const sql = `
            SELECT DISTINCT b.id, b.type, b.description, p.standard_quantity, p.vegan_quantity, p.diabetic_quantity
            FROM boxes b
            JOIN weekly_plans p ON b.provider_id = p.provider_id
            WHERE b.provider_id = ? AND p.week_start BETWEEN ? AND ?
        `;
        const boxes = await query(sql, [provider_id, startDate, endDate]);

        res.json(boxes);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения коробок' });
    }
});

export default router;
