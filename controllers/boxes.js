import query from '../config/db.js';

// Scenario 1: View available boxes for a day or period
const boxesControllers = {
    getAvailableBoxes: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;

            const sql = `
                SELECT b.id, b.type, b.description, wp.standard_quantity, wp.vegan_quantity, wp.diabetic_quantity, wp.pickup_time
                FROM boxes b
                JOIN weekly_plans wp ON b.id = wp.box_id
                WHERE wp.week_start BETWEEN ? AND ?;
            `;
            const result = await query(sql, [startDate, endDate]);

            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving available boxes', error });
        }
    }
};

export default boxesControllers;
