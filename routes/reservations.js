import express from 'express';
import query from '../config/db.js';

const router = express.Router();

// Create a reservation for a user
router.post('/', async (req, res) => {
    const { user_id, provider_id, box_id, reservation_date, quantity } = req.body;

    try {
        // Ensure that reservation_date is processed correctly (without adding any extra days)
        const formattedReservationDate = reservation_date.split('T')[0];

        // Get the box type from the boxes table
        const boxTypeSql = 'SELECT type FROM boxes WHERE id = ?';
        const box = await query(boxTypeSql, [box_id]);
        
        if (box.length === 0) {
            return res.status(404).json({ message: 'Box type not found' });
        }

        const boxType = box[0].type.toLowerCase() + '_quantity';

        // Check the available quantity for the selected box type on the specified date
        const checkQuantitySql = 
            'SELECT ' + boxType + ' FROM weekly_plans WHERE provider_id = ? AND week_start = ?';
        const availableBox = await query(checkQuantitySql, [provider_id, formattedReservationDate]);

        if (availableBox.length === 0 || availableBox[0][boxType] < quantity) {
            return res.status(400).json({ message: 'Not enough boxes available for reservation' });
        }

        // Update the quantity of boxes in the weekly plan
        const updatePlanSql = 
            'UPDATE weekly_plans SET ' + boxType + ' = ' + boxType + ' - ? WHERE provider_id = ? AND week_start = ?';
        await query(updatePlanSql, [quantity, provider_id, formattedReservationDate]);

        // Insert the new reservation with the specified date
        const sql = 
            'INSERT INTO reservations (user_id, provider_id, box_id, reservation_date, quantity, status) VALUES (?, ?, ?, ?, ?, "active")';
        await query(sql, [user_id, provider_id, box_id, formattedReservationDate, quantity]);

        res.status(201).json({ message: 'Reservation successfully created' });
    } catch (err) {
        res.status(500).json({ error: 'Error creating reservation' });
    }
});

// Retrieve all active reservations for a user
router.get('/user/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const { date } = req.query;  // Retrieve reservations for a specific date if provided

    let sql = 
        'SELECT r.id, r.reservation_date, r.quantity, r.status, b.type, p.name AS provider_name, p.address ' +
        'FROM reservations r ' +
        'JOIN boxes b ON r.box_id = b.id ' +
        'JOIN providers p ON r.provider_id = p.id ' +
        'WHERE r.user_id = ? AND r.status = "active"';
    
    const params = [user_id];
    
    if (date) {
        sql += ' AND r.reservation_date = ?';
        params.push(date);
    }

    try {
        const reservations = await query(sql, params);
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving reservations' });
    }
});

// Retrieve all active reservations for a provider within a date range
router.get('/provider/:provider_id', async (req, res) => {
    const { provider_id } = req.params;
    const { startDate, endDate } = req.query;

    let sql = 
        'SELECT r.id, r.reservation_date, r.quantity, r.status, b.type, u.name AS user_name, u.email ' +
        'FROM reservations r ' +
        'JOIN boxes b ON r.box_id = b.id ' +
        'JOIN users u ON r.user_id = u.id ' +
        'WHERE r.provider_id = ? AND r.status = "active"';
    
    const params = [provider_id];
    
    if (startDate && endDate) {
        sql += ' AND r.reservation_date BETWEEN ? AND ?';
        params.push(startDate, endDate);
    }

    try {
        const reservations = await query(sql, params);

        // Format the reservation_date by adding one day before sending the response
        const formattedReservations = reservations.map(reservation => ({
            ...reservation,
            reservation_date: reservation.reservation_date.toISOString().split('T')[0],
        }));

        res.json(formattedReservations);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving reservations' });
    }
});

// Retrieve the history of issued reservations for a provider within a date range
router.get('/provider/:provider_id/history', async (req, res) => {
    const { provider_id } = req.params;
    const { startDate, endDate } = req.query;

    let sql = 
        'SELECT r.id, r.issued_date, r.quantity, b.type, u.name AS user_name, u.email ' +
        'FROM reservations r ' +
        'JOIN boxes b ON r.box_id = b.id ' +
        'JOIN users u ON r.user_id = u.id ' +
        'WHERE r.provider_id = ? AND r.status = "issued"';
    
    const params = [provider_id];
    
    if (startDate && endDate) {
        sql += ' AND r.issued_date BETWEEN ? AND ?';
        params.push(startDate, endDate);
    }

    try {
        const reservations = await query(sql, params);
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving reservation history' });
    }
});

// Retrieve the history of issued reservations for a user within a date range
router.get('/user/:user_id/history', async (req, res) => {
    const { user_id } = req.params;
    const { startDate, endDate } = req.query;

    let sql = 
        'SELECT r.id, r.issued_date, r.quantity, b.type, p.name AS provider_name, p.address ' +
        'FROM reservations r ' +
        'JOIN boxes b ON r.box_id = b.id ' +
        'JOIN providers p ON r.provider_id = p.id ' +
        'WHERE r.user_id = ? AND r.status = "issued"';
    
    const params = [user_id];
    
    if (startDate && endDate) {
        sql += ' AND r.issued_date BETWEEN ? AND ?';
        params.push(startDate, endDate);
    }

    try {
        const reservations = await query(sql, params);
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving reservation history' });
    }
});

// Issue all reservations for a specific user on a specific date
router.post('/issue/all', async (req, res) => {
    const { provider_id, user_id, issue_date } = req.body;

    try {
        const sql = `
            UPDATE reservations
            SET status = 'issued', issued_date = NOW()
            WHERE provider_id = ? AND user_id = ? AND reservation_date = ? AND status = 'active'
        `;
        const result = await query(sql, [provider_id, user_id, issue_date]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No active reservations found for this user on the specified date' });
        }

        res.json({ message: 'All reservations for the user on this date have been issued' });
    } catch (err) {
        res.status(500).json({ error: 'Error issuing reservations' });
    }
});

// Issue a specific reservation by ID
router.post('/issue/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const sql = `
            UPDATE reservations
            SET status = 'issued', issued_date = NOW()
            WHERE id = ? AND status = 'active'
        `;
        const result = await query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reservation not found or already issued' });
        }

        res.json({ message: 'Reservation has been successfully issued' });
    } catch (err) {
        res.status(500).json({ error: 'Error issuing reservation' });
    }
});

export default router;
