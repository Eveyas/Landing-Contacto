import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalLeads: 0
  });
  const [userInfo, setUserInfo] = useState({
    name: 'Administrador',
    lastname: '',
    email: 'admin@gmail.com'
  });
  const [globalStatusCounts, setGlobalStatusCounts] = useState({
    nuevo: 0,
    contactado: 0,
    descartado: 0
  });

  // Datos simulados
  const mockLeads = [
    {
      id: 1,
      nombre: 'Juan',
      apellidos: 'Pérez',
      correo: 'juan@gmail.com',
      telefono: '123456789',
      estado: 'nuevo',
      created_at: new Date()
    },
    {
      id: 2,
      nombre: 'María',
      apellidos: 'Gómez',
      correo: 'maria@gmail.com',
      telefono: '987654321',
      estado: 'contactado',
      created_at: new Date(Date.now() - 86400000)
    },
    {
      id: 3,
      nombre: 'Carlos',
      apellidos: 'López',
      correo: 'carlos@gmail.com',
      telefono: '555555555',
      estado: 'descartado',
      created_at: new Date(Date.now() - 172800000)
    }
  ];

  useEffect(() => {
    // Verificar autenticación
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Simular carga de datos
    setLoading(true);
    setTimeout(() => {
      setLeads(mockLeads);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalLeads: mockLeads.length
      });
      
      // Calcular conteos de estado
      const counts = mockLeads.reduce((acc, lead) => {
        acc[lead.estado] = (acc[lead.estado] || 0) + 1;
        return acc;
      }, { nuevo: 0, contactado: 0, descartado: 0 });
      
      setGlobalStatusCounts(counts);
      setLoading(false);
    }, 1000);
  }, [navigate]);

  const handleStatusChange = (leadId, newStatus) => {
    setLeads(leads.map(lead =>
      lead.id === leadId ? { ...lead, estado: newStatus } : lead
    ));
    
    // Actualizar contadores
    const counts = leads.reduce((acc, lead) => {
      const status = lead.id === leadId ? newStatus : lead.estado;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, { nuevo: 0, contactado: 0, descartado: 0 });
    
    setGlobalStatusCounts(counts);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="user-avatar">
            <img
              src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg"
              alt="User_Dashboard"
              className="avatar-image"
            />
            <div className="avatar-overlay"></div>
          </div>
          <div className="user-info">
            <h3>{userInfo.name} {userInfo.lastname}</h3>
            <p>{userInfo.email}</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className="active">
              <i className="icon-leads"></i>
              <span>Leads</span>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <i className="icon-logout"></i>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="dashboard-content">
        <header className="dashboard-header">
          <div className="header-center">
            <h1>Panel de Administración</h1>
            <p>Gestión de Leads</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-value">{pagination.totalLeads}</span>
              <span className="stat-label">Leads Totales</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{globalStatusCounts.nuevo}</span>
              <span className="stat-label">Nuevos</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{globalStatusCounts.contactado}</span>
              <span className="stat-label">Contactados</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{globalStatusCounts.descartado}</span>
              <span className="stat-label">Descartados</span>
            </div>
          </div>
        </header>

        <div className="dashboard-main">
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Lista de Leads</h2>
              <div className="pagination-info">
                Página {pagination.currentPage} de {pagination.totalPages}
              </div>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando leads...</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Teléfono</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id}>
                        <td>{lead.id}</td>
                        <td>{lead.nombre} {lead.apellidos}</td>
                        <td>{lead.correo}</td>
                        <td>{lead.telefono}</td>
                        <td>
                          <select
                            value={lead.estado}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className={`status-select ${lead.estado}`}
                          >
                            <option value="nuevo">Nuevo</option>
                            <option value="contactado">Contactado</option>
                            <option value="descartado">Descartado</option>
                          </select>
                        </td>
                        <td>{new Date(lead.created_at).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
