const path = require('node:path');
const config = require('dotenv').config({ path: path.join(__dirname, '..', '.env') }).parsed;
const { log } = require('./utils');

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASS,
    database: config.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

async function testConnect() {
    // Получаем соединение из пула
  //  const connection = await pool.getConnection();
  //  log('info', `Connected to mysql ${config.DB_HOST}`);
   // connection.release();
}

async function addLog(type, text) {
  //  await pool.query(`INSERT INTO mqtt_log (type, text) VALUES (?, ?)`, [type, text]);
}

async function addValueBySensor(clientId, sensor, value) {
   // await pool.query(`INSERT INTO mqtt_client (clientId, sensor, value) VALUES (?, ?, ?)`, [clientId, sensor, value]);
}

async function updateConfigByClient(clientId, config) {
    const [rows] = await pool.query(`SELECT * FROM mqtt_config WHERE clientId = ?`, [clientId]);

    if (rows.length === 0) {
        // запись не найдена, создаем новую
      //  await pool.query(`INSERT INTO mqtt_config SET ?`, { clientId, config });
    } else {
        // запись найдена, обновляем
      //  await pool.query(`UPDATE mqtt_config SET ? WHERE clientId = ?`, [{ config }, clientId]);
    }
}

/* async function mysqlQuery(query, values) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.execute(query, values);
    } catch (error) {
        log('error', error);
        if (connection) await connection.release();
    }
} */

module.exports = {
    addLog,
    addValueBySensor,
    testConnect,
    updateConfigByClient,
};
