const { pool } = require('../database/connection');
(async () => {
  try {
    const { rows } = await pool.query(
      "select current_database() as db, current_user as usr, inet_client_addr() as ip, now() as now"
    );
    console.log('OK ✅ Conectado:', rows[0]);
  } catch (e) {
    console.error('❌ Error de conexión:', e);
  } finally {
    await pool.end();
  }
})();
