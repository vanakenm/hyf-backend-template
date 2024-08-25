import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10
});

console.log('MySQL Pool created successfully');

// Create query
const query = async (sql, values) => {
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query(sql, values);
        return results;
    } catch (err) {
        return err;
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

export default query;
