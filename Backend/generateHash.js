// Archivo para actualizar HASH
const bcrypt = require('bcryptjs');

async function createHash() {
  const hash = await bcrypt.hash('admin123', 10);
  console.log('NUEVO HASH VÁLIDO:', hash);
}

createHash();
