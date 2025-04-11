import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/equipes-temporadas';

function EquipesTemporadasCRUD() {
  const [relacoes, setRelacoes] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  const [formData, setFormData] = useState({
    id_equipe: '',
    id_temporada: ''
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
      
      // Busca as relações
      const relacoesResponse = await axios.get(API_URL);
      setRelacoes(relacoesResponse.data);
      
      // Busca as equipes (você precisará criar essa rota ou ajustar conforme sua API)
      const equipesResponse = await axios.get('http://localhost:3000/api/equipes');
      setEquipes(equipesResponse.data);
      
      // Busca as temporadas
      const temporadasResponse = await axios.get('http://localhost:3000/api/temporadas');
      setTemporadas(temporadasResponse.data);
      
      setLoading(false);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        setSuccessMessage('Relação atualizada com sucesso!');
      } else {
        await axios.post(API_URL, formData);
        setSuccessMessage('Relação criada com sucesso!');
      }
      fetchData();
      resetForm();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao salvar relação');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta relação?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setSuccessMessage('Relação excluída com sucesso!');
        fetchData();
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        setError('Erro ao excluir relação');
      }
    }
  };

  const handleEdit = (relacao) => {
    setFormData({
      id_equipe: relacao.id_equipe,
      id_temporada: relacao.id_temporada
    });
    setEditingId(relacao.id_equipe_temporada);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      id_equipe: '',
      id_temporada: ''
    });
    setEditingId(null);
    setError(null);
  };

  if (loading) return <div className="p-4">Carregando...</div>;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Equipes por Temporada</h1>
      
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
          {editingId ? `Editando Relação #${editingId}` : 'Nova Relação'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equipe*</label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.id_equipe}
                onChange={(e) => setFormData({...formData, id_equipe: e.target.value})}
                required
              >
                <option value="">Selecione uma equipe</option>
                {equipes.map(equipe => (
                  <option key={equipe.id_equipe} value={equipe.id_equipe}>
                    {equipe.nome_equipe}
                  </option>
                ))}
              </select>
            </div>
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
                    {temporada.ano_temporada} ({temporada.status_temporada})
                  </option>
                ))}
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
              {editingId ? 'Atualizar Relação' : 'Cadastrar Relação'}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temporada</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {relacoes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    Nenhuma relação cadastrada
                  </td>
                </tr>
              ) : (
                relacoes.map(relacao => {
                  const equipe = equipes.find(e => e.id_equipe === relacao.id_equipe);
                  const temporada = temporadas.find(t => t.id_temporada === relacao.id_temporada);
                  
                  return (
                    <tr key={relacao.id_equipe_temporada} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{relacao.id_equipe_temporada}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {equipe ? equipe.nome_equipe : 'Equipe não encontrada'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {temporada ? temporada.ano_temporada : 'Temporada não encontrada'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {temporada && (
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            temporada.status_temporada === 'Ativa' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {temporada.status_temporada}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleEdit(relacao)}
                          className="text-blue-600 hover:text-blue-900 hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(relacao.id_equipe_temporada)}
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

export default EquipesTemporadasCRUD;