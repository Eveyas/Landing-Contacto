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
    res.status(500).json({ error: 'Error al obtener los leads' });
  }
};

const updateLeadStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const validStatuses = ['nuevo', 'contactado', 'descartado'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  try {
    await db.query(
      'UPDATE ContacUs SET estado = ? WHERE id = ?',
      [status, id]
    );
    
    res.json({ message: 'Estado actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estado' });
  }
};

module.exports = { getLeads, updateLeadStatus };