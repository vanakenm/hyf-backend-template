import express from 'express';
import query from '../config/db.js';

const router = express.Router();

// Create a reservation
router.post('/', async (req, res) => {
    const { user_id, provider_id, box_id, reservation_date, quantity } = req.body;

    try {
        // Determine the type of box
        const boxTypeSql = 'SELECT type FROM boxes WHERE id = ?';
        const box = await query(boxTypeSql, [box_id]);
        
        if (box.length === 0) {
            return res.status(404).json({ message: 'Тип коробки не найден' });
        }

        const boxType = box[0].type.toLowerCase() + '_quantity';

        // Checking the available number of boxes
        const checkQuantitySql = `
            SELECT ${boxType} FROM weekly_plans WHERE provider_id = ? AND week_start = ?
        `;
        const availableBox = await query(checkQuantitySql, [provider_id, reservation_date]);

        if (availableBox.length === 0 || availableBox[0][boxType] < quantity) {
            return res.status(400).json({ message: 'Not enough boxes to reserve' });
        }

        // Update the number of boxes in weekly_plans
        const updatePlanSql = `
            UPDATE weekly_plans
            SET ${boxType} = ${boxType} - ?
            WHERE provider_id = ? AND week_start = ?
        `;
        await query(updatePlanSql, [quantity, provider_id, reservation_date]);

        // Adding a new reservation
        const sql = `
            INSERT INTO reservations (user_id, provider_id, box_id, reservation_date, quantity, status)
            VALUES (?, ?, ?, ?, ?, 'active')
        `;
        await query(sql, [user_id, provider_id, box_id, reservation_date, quantity]);

        res.status(201).json({ message: 'Reservation successfully created' });
    } catch (err) {
        res.status(500).json({ error: 'Error creating reservation' });
    }
});

// Issuing boxes
router.put('/issue/:reservation_id', async (req, res) => {
    const { issued_date, box_id } = req.body;
    const { reservation_id } = req.params;

    try {
        let sql;
        let params;

        if (box_id) {
            // Issuance of a specific box
            sql = `
                UPDATE reservations
                SET status = 'issued', issued_date = ?
                WHERE id = ? AND box_id = ? AND status = 'active'
            `;
            params = [issued_date, reservation_id, box_id];
        } else {
            // Issuance of all boxes
            sql = `
                UPDATE reservations
                SET status = 'issued', issued_date = ?
                WHERE id = ? AND status = 'active'
            `;
            params = [issued_date, reservation_id];
        }

        const result = await query(sql, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reservation not found or already issued' });
        }

        res.json({ message: 'Box(es) successfully issued' });
    } catch (err) {
        res.status(500).json({ error: 'Error while issuing' });
    }
});

export default router;
