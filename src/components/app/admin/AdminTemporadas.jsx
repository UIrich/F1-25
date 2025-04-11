import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/temporadas';

function TemporadasCRUD() {
  const [temporadas, setTemporadas] = useState([]);
  const [formData, setFormData] = useState({
    ano_temporada: '',
    status_temporada: 'Ativa'
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('Todas');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setTemporadas(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar temporadas');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        setSuccessMessage('Temporada atualizada com sucesso!');
      } else {
        await axios.post(API_URL, formData);
        setSuccessMessage('Temporada criada com sucesso!');
      }
      fetchData();
      resetForm();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao salvar temporada');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta temporada?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setSuccessMessage('Temporada excluída com sucesso!');
        fetchData();
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        setError('Erro ao excluir temporada');
      }
    }
  };

  const handleEdit = (temporada) => {
    setFormData({
      ano_temporada: temporada.ano_temporada,
      status_temporada: temporada.status_temporada
    });
    setEditingId(temporada.id_temporada);
  };

  const resetForm = () => {
    setFormData({
      ano_temporada: '',
      status_temporada: 'Ativa'
    });
    setEditingId(null);
    setError(null);
  };

  const temporadasFiltradas = filtroStatus === 'Todas' 
    ? temporadas 
    : temporadas.filter(t => t.status_temporada === filtroStatus);

  if (loading) return <div className="p-4">Carregando...</div>;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Temporadas</h1>
      
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? `Editando Temporada #${editingId}` : 'Nova Temporada'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ano*</label>
              <input
                type="number"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.ano_temporada}
                onChange={(e) => setFormData({...formData, ano_temporada: e.target.value})}
                required
                min="1950"
                max="2100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.status_temporada}
                onChange={(e) => setFormData({...formData, status_temporada: e.target.value})}
                required
              >
                <option value="Ativa">Ativa</option>
                <option value="Finalizada">Finalizada</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {editingId ? 'Atualizar Temporada' : 'Cadastrar Temporada'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Lista de Temporadas</h2>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Filtrar por status:</label>
            <select
              className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="Todas">Todas</option>
              <option value="Ativa">Ativa</option>
              <option value="Finalizada">Finalizada</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ano</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {temporadasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    Nenhuma temporada encontrada
                  </td>
                </tr>
              ) : (
                temporadasFiltradas.map(temporada => (
                  <tr key={temporada.id_temporada} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{temporada.id_temporada}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{temporada.ano_temporada}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        temporada.status_temporada === 'Ativa' 
                          ? 'bg-green-100 text-green-800' 
                          : temporada.status_temporada === 'Planejada'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {temporada.status_temporada}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleEdit(temporada)}
                        className="text-blue-600 hover:text-blue-900 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(temporada.id_temporada)}
                        className="text-red-600 hover:text-red-900 hover:underline"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TemporadasCRUD;