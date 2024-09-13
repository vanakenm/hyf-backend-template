import query from '../config/db.js';

const reservationsControllers = {
    getUserReservations: async (req, res) => {
        const { userId } = req.params;
        try {
            const [rows] = await query('SELECT * FROM reservations WHERE user_id = ? AND status = "active"', [userId]);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ message: 'Error retrieving reservations' });
        }
    },
    completeReservation: async (req, res) => {
        const { reservationId } = req.params;
        try {
            await query('UPDATE reservations SET status = "completed", issued_date = NOW() WHERE id = ?', [reservationId]);
            res.status(200).json({ message: 'Reservation completed' });
        } catch (err) {
            res.status(500).json({ message: 'Error completing reservation' });
        }
    }
};

export default reservationsControllers;
