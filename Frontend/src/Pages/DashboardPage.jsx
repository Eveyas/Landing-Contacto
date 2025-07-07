import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Authentication/AuthContext';
import axios from 'axios';
import '../styles/dashboard.css';

const DashboardPage = () => {
  const { currentUser, logout } = useAuth();
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
    email: ''
  });
  
  const [globalStatusCounts, setGlobalStatusCounts] = useState({
    nuevo: 0,
    contactado: 0,
    descartado: 0
  });

 useEffect(() => {
  if (!currentUser) {
    navigate('/login');
    return;
  }
  fetchLeads();
  fetchUserInfo();
  fetchGlobalStatusCounts();
}, [pagination.currentPage, currentUser, fetchLeads, fetchUserInfo, fetchGlobalStatusCounts, navigate]);

  const fetchGlobalStatusCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/leads/status-counts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setGlobalStatusCounts(response.data);
    } catch (error) {
      console.error('Error fetching global status counts:', error);
    }
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/leads?page=${pagination.currentPage}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setLeads(response.data.leads);
      setPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        totalLeads: response.data.pagination.totalLeads
      });
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/auth/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUserInfo({
        name: response.data.name || 'Administrador',
        lastname: response.data.lastname || '',
        email: response.data.email || ''
      });
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3000/api/leads/${leadId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, estado: newStatus } : lead
      ));
      
      fetchGlobalStatusCounts();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, currentPage: newPage });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!currentUser) return null;

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

      {/* Contenido */}
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
              <>
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
                          <td>
                            <div className="lead-name">
                              {lead.nombre} {lead.apellidos}
                            </div>
                          </td>
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
                          <td>
                            {new Date(lead.created_at).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginación */}
                <div className="pagination-controls">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="pagination-btn prev"
                  >
                    &lt; Anterior
                  </button>
                  
                  <div className="pagination-numbers">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`pagination-number ${pagination.currentPage === page ? 'active' : ''}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="pagination-btn next"
                  >
                    Siguiente &gt;
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
