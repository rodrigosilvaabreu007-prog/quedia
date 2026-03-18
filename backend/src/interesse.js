const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// Marcar interesse
async function marcarInteresse(usuario_id, evento_id) {
  const query = {
    text: 'INSERT INTO interesses (usuario_id, evento_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    values: [usuario_id, evento_id]
  };
  await pool.query(query);
}

// Contador de interessados
async function contarInteressados(evento_id) {
  const query = {
    text: 'SELECT COUNT(*) FROM interesses WHERE evento_id = $1',
    values: [evento_id]
  };
  const result = await pool.query(query);
  return parseInt(result.rows[0].count);
}

module.exports = {
  marcarInteresse,
  contarInteressados
};
