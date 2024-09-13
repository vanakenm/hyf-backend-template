import express from 'express';
import query from '../config/db.js';

const router = express.Router();

// Receive box offers for a period of time
router.get('/', async (req, res) => {
    const { startDate, endDate } = req.query;
    
    try {
        const sql = `
            SELECT provider_id, week_start, standard_quantity, vegan_quantity, diabetic_quantity, pickup_time
            FROM weekly_plans
            WHERE week_start BETWEEN ? AND ?
        `;
        const offers = await query(sql, [startDate, endDate]);
        res.json(offers);
    } catch (err) {
        res.status(500).json({ error: 'Error receiving offers for boxes' });
    }
});

export default router;
