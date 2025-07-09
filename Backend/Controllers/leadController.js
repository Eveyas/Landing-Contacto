const db = require('../Config/Db.js');

const getLeads = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [leads] = await db.query(
      'SELECT * FROM ContacUs ORDER BY id DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    
    const [total] = await db.query('SELECT COUNT(*) AS total FROM ContacUs');
    const totalLeads = total[0].total;
    
    res.json({
      leads,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalLeads / limit),
        totalLeads
      }
    });
    
  } catch (error) {
    console.error('Error al obtener los leads:', error);
    res.status(500).json({ error: 'Error al obtener los leads' });
  }
};

const updateLeadStatus = async (req, res) => {
const { id } = req.params;
  const { status } = req.body;
    try {
      await db.query(
        'UPDATE ContacUs SET estado = ? WHERE id = ?',
        [status, id]
      );
      
      res.json({ message: 'Estado actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar el estado del lead:', error);
      res.status(500).json({ error: 'Error al actualizar el estado' });
    }
  };

const getStatusCounts = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        SUM(CASE WHEN estado = 'nuevo' THEN 1 ELSE 0 END) AS nuevo,
        SUM(CASE WHEN estado = 'contactado' THEN 1 ELSE 0 END) AS contactado,
        SUM(CASE WHEN estado = 'descartado' THEN 1 ELSE 0 END) AS descartado
      FROM ContacUs
    `);
    
    res.json({
      nuevo: results[0].nuevo,
      contactado: results[0].contactado,
      descartado: results[0].descartado
    });
  } catch (error) {
    console.error('Error al obtener contadores de estado:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

module.exports = { 
  getLeads, 
  updateLeadStatus,
  getStatusCounts
};
