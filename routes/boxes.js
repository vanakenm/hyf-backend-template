import express from 'express';
import query from '../config/db.js';

const router = express.Router();

// Receive boxes by store and date
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
        res.status(500).json({ error: 'Error receiving boxes' });
    }
});

export default router;
