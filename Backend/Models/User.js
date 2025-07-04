const db = require('../Config/Db.js');
const bcrypt = require('bcryptjs');

class User {
  static async create({ username, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    return result.insertId;
  }

  static async findByUsername(username) {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  }

   static async comparePasswords(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error('Error comparando contraseñas:', error);
      return false;
    }
  }
}

module.exports = User;