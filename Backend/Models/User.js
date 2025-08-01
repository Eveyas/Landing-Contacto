const db = require('../Config/Db');
const bcrypt = require('bcryptjs');

class User {
  /**
   * Crear nuevo usuario
   * @param {Object} userData - {username, password}
   * @returns {Promise<Object>} Usuario creado
   */
  static async create({ username, password }) {
    const { rows } = await db.query(
      `INSERT INTO users (username, password) 
       VALUES ($1, $2) 
       RETURNING id, username, created_at`,
      [username, password]
    );
    return rows[0];
  }

  /**
   * Buscar usuario por username
   * @param {String} username
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  static async findByUsername(username) {
    const { rows } = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return rows[0] || null;
  }

  /**
   * Obtener todos los usuarios
   * @returns {Promise<Array>} Lista de usuarios
   */
  static async findAll() {
    const { rows } = await db.query(
      'SELECT id, username, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  }

  /**
   * Comparar contraseña con hash
   * @param {String} password
   * @param {String} hash
   * @returns {Promise<Boolean>} Si coinciden
   */
  static async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

module.exports = User;