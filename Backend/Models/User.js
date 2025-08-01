const db = require('../Config/Db');
const bcrypt = require('bcryptjs');

class User {
  /**
   * @desc    Crear un nuevo usuario
   * @param   {Object} userData - Datos del usuario {username, password}
   * @return  {Promise} Retorna el ID del usuario creado
   */
  static async create({ username, password }) {
    const { rows } = await db.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, password]
    );
    return rows[0];
  }

  /**
   * @desc    Buscar usuario por nombre de usuario
   * @param   {String} username
   * @return  {Promise} Retorna el usuario o undefined
   */
  static async findByUsername(username) {
    const { rows } = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return rows[0];
  }

  /**
   * @desc    Obtener todos los usuarios
   * @return  {Promise} Retorna array de usuarios
   */
  static async findAll() {
    const { rows } = await db.query(
      'SELECT id, username, created_at FROM users'
    );
    return rows;
  }

  /**
   * @desc    Comparar contraseñas
   * @param   {String} password - Contraseña en texto plano
   * @param   {String} hashedPassword - Contraseña hasheada
   * @return  {Promise<Boolean>} Retorna true si coinciden
   */
  static async comparePasswords(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;