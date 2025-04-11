import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/corridas';

function CorridasCRUD() {
  const [corridas, setCorridas] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  const [formData, setFormData] = useState({
    id_temporada: '',
    nome_corrida: '',
    local_corrida: '',
    data_corrida: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [corridasRes, temporadasRes] = await Promise.all([
        axios.get(API_URL),
        axios.get('http://localhost:3000/api/temporadas')
      ]);
      
      setCorridas(corridasRes.data);
      setTemporadas(temporadasRes.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar dados');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        data_corrida: formData.data_corrida || null
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
        setSuccessMessage('Corrida atualizada com sucesso!');
      } else {
        await axios.post(API_URL, payload);
        setSuccessMessage('Corrida criada com sucesso!');
      }
      
      fetchData();
      resetForm();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao salvar corrida');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta corrida?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setSuccessMessage('Corrida excluída com sucesso!');
        fetchData();
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        setError('Erro ao excluir corrida. Verifique se não há resultados vinculados.');
      }
    }
  };

  const handleEdit = (corrida) => {
    setFormData({
      id_temporada: corrida.id_temporada,
      nome_corrida: corrida.nome_corrida,
      local_corrida: corrida.local_corrida,
      data_corrida: corrida.data_corrida ? corrida.data_corrida.split('T')[0] : ''
    });
    setEditingId(corrida.id_corrida);
  };

  const resetForm = () => {
    setFormData({
      id_temporada: '',
      nome_corrida: '',
      local_corrida: '',
      data_corrida: ''
    });
    setEditingId(null);
    setError(null);
  };

  if (loading) return <div className="p-4">Carregando...</div>;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Corridas</h1>
      
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
          {editingId ? `Editando Corrida #${editingId}` : 'Nova Corrida'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temporada*</label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.id_temporada}
                onChange={(e) => setFormData({...formData, id_temporada: e.target.value})}
                required
              >
                <option value="">Selecione uma temporada</option>
                {temporadas.map(temporada => (
                  <option key={temporada.id_temporada} value={temporada.id_temporada}>
                    {temporada.ano_temporada}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Corrida*</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.nome_corrida}
                onChange={(e) => setFormData({...formData, nome_corrida: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Local (Circuito + País)*</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.local_corrida}
                onChange={(e) => setFormData({...formData, local_corrida: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data da Corrida</label>
              <input
                type="date"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.data_corrida}
                onChange={(e) => setFormData({...formData, data_corrida: e.target.value})}
              />
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
              {editingId ? 'Atualizar Corrida' : 'Cadastrar Corrida'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temporada</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {corridas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Nenhuma corrida cadastrada
                  </td>
                </tr>
              ) : (
                corridas.map(corrida => {
                  const temporada = temporadas.find(t => t.id_temporada === corrida.id_temporada);
                  
                  return (
                    <tr key={corrida.id_corrida} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{corrida.id_corrida}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{corrida.nome_corrida}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{corrida.local_corrida}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {temporada ? temporada.ano_temporada : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {corrida.data_corrida ? new Date(corrida.data_corrida).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleEdit(corrida)}
                          className="text-blue-600 hover:text-blue-900 hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(corrida.id_corrida)}
                          className="text-red-600 hover:text-red-900 hover:underline"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CorridasCRUD;