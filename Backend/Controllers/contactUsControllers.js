const db = require ('../Config/Db.js');

const getContactUs = (req, res) => {
  db.query('SELECT * FROM ContacUs', (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.status(200).json(results);
  });
}

const postContactUs = (req, res) => {
  const {nombre, apellidos, correo, telefono, mensaje} = req.body;
  if (!nombre || !apellidos || !correo || !telefono || !mensaje) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO ContacUs (nombre, apellidos, correo, telefono, mensaje) VALUES (?,?,? ,?, ?)';
  db.query(query, [nombre, apellidos, correo, telefono, mensaje], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database insert failed' });
    }
    res.status(201).json({ message: 'Contact Us entry created successfully', id: results.insertId });
  });
}

module.exports = {
  getContactUs,
  postContactUs
};