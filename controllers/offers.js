import query from '../config/db.js';

const offersControllers = {
    getOffers: async (req, res) => {
        try {
            const sql = `
                SELECT week_start, standard_quantity, vegan_quantity, diabetic_quantity, pickup_time 
                FROM weekly_plans 
                WHERE provider_id = ?;
            `;
            const result = await query(sql, [req.query.provider_id]);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving offers', error });
        }
    }
};

export default offersControllers;
