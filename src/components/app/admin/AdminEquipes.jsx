import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

function EquipesCRUD() {
  const [equipes, setEquipes] = useState([]);
  const [formData, setFormData] = useState({
    nome_equipe: '',
    fundacao_equipe: '',
    logo_equipe_url: '',
    descricao_equipe: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEquipes();
  }, []);

  const fetchEquipes = async () => {
    try {
      const response = await axios.get(`${API_URL}/equipes`);
      setEquipes(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar equipes');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/equipes/${editingId}`, formData);
      } else {
        await axios.post(`${API_URL}/equipes`, formData);
      }
      fetchEquipes();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao salvar equipe');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta equipe?')) {
      try {
        await axios.delete(`${API_URL}/equipes/${id}`);
        fetchEquipes();
      } catch (err) {
        setError('Erro ao excluir equipe');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nome_equipe: '',
      fundacao_equipe: '',
      logo_equipe_url: '',
      descricao_equipe: ''
    });
    setEditingId(null);
  };

  if (loading) return <div className="p-4">Carregando...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Equipes</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? `Editando Equipe #${editingId}` : 'Nova Equipe'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome*</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.nome_equipe}
                onChange={(e) => setFormData({...formData, nome_equipe: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fundação</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={formData.fundacao_equipe}
                onChange={(e) => setFormData({...formData, fundacao_equipe: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo (URL)</label>
              <input
                type="url"
                className="w-full p-2 border rounded"
                value={formData.logo_equipe_url}
                onChange={(e) => setFormData({...formData, logo_equipe_url: e.target.value})}
                placeholder="https://exemplo.com/logo.jpg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                className="w-full p-2 border rounded"
                value={formData.descricao_equipe}
                onChange={(e) => setFormData({...formData, descricao_equipe: e.target.value})}
                rows="3"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {editingId ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Logo</th>
              <th className="px-6 py-3 text-left">Nome</th>
              <th className="px-6 py-3 text-left">Fundação</th>
              <th className="px-6 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {equipes.map((equipe) => (
              <tr key={equipe.id_equipe} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">
                  {equipe.logo_equipe_url ? (
                    <img 
                      src={equipe.logo_equipe_url} 
                      alt={equipe.nome_equipe}
                      className="h-10 object-contain"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 rounded"></div>
                  )}
                </td>
                <td className="px-6 py-4 font-medium">{equipe.nome_equipe}</td>
                <td className="px-6 py-4">
                  {equipe.fundacao_equipe 
                    ? new Date(equipe.fundacao_equipe).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) 
                    : '-'}
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => {
                      setFormData({
                        nome_equipe: equipe.nome_equipe,
                        fundacao_equipe: equipe.fundacao_equipe?.split('T')[0] || '',
                        logo_equipe_url: equipe.logo_equipe_url || '',
                        descricao_equipe: equipe.descricao_equipe || ''
                      });
                      setEditingId(equipe.id_equipe);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(equipe.id_equipe)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EquipesCRUD;