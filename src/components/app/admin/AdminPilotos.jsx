import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Note o /api adicional
const PILOTOS_URL = `${API_URL}/pilotos`;

function PilotosCRUD() {
  // Estados
  const [pilotos, setPilotos] = useState([]);
  const [formData, setFormData] = useState({
    nome_piloto: '',
    nacionalidade_piloto: '',
    data_nascimento_piloto: '',
    foto_piloto_url: '',
    descricao_piloto: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar dados
  const fetchData = async () => {
    try {
      setLoading(true);
      const [pilotosRes] = await Promise.all([
        axios.get(PILOTOS_URL),
      ]);
      setPilotos(pilotosRes.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Manipular mudanças no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Enviar formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${PILOTOS_URL}/${editingId}`, formData);
      } else {
        await axios.post(PILOTOS_URL, formData);
      }
      await fetchData();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao salvar piloto');
      console.error(err);
    }
  };

  // Editar piloto
  const handleEdit = (piloto) => {
    setFormData({
      nome_piloto: piloto.nome_piloto,
      nacionalidade_piloto: piloto.nacionalidade_piloto,
      data_nascimento_piloto: piloto.data_nascimento_piloto?.split('T')[0] || '',
      foto_piloto_url: piloto.foto_piloto_url || '',
      descricao_piloto: piloto.descricao_piloto || ''
    });
    setEditingId(piloto.id_piloto);
  };

  // Deletar piloto
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este piloto?')) return;
    
    try {
      await axios.delete(`${PILOTOS_URL}/${id}`);
      await fetchData();
    } catch (err) {
      setError('Erro ao deletar piloto');
      console.error(err);
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      nome_piloto: '',
      nacionalidade_piloto: '',
      data_nascimento_piloto: '',
      foto_piloto_url: '',
      descricao_piloto: ''
    });
    setEditingId(null);
  };

  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
      <p>{error}</p>
      <button 
        onClick={fetchData}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Tentar novamente
      </button>
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gerenciamento de Pilotos</h1>
      
      {/* Formulário */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {editingId ? `Editando Piloto #${editingId}` : 'Adicionar Novo Piloto'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome*</label>
              <input
                type="text"
                name="nome_piloto"
                value={formData.nome_piloto}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Nome completo do piloto"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nacionalidade</label>
              <input
                type="text"
                name="nacionalidade_piloto"
                value={formData.nacionalidade_piloto}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="País de origem"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
              <input
                type="date"
                name="data_nascimento_piloto"
                value={formData.data_nascimento_piloto}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL da Foto</label>
              <input
                type="url"
                name="foto_piloto_url"
                value={formData.foto_piloto_url}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://exemplo.com/foto.jpg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              name="descricao_piloto"
              value={formData.descricao_piloto}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Informações adicionais sobre o piloto"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Cancelar
              </button>
            )}
            
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {editingId ? 'Atualizar Piloto' : 'Cadastrar Piloto'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Tabela de Pilotos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Lista de Pilotos</h2>
          <span className="text-sm text-gray-500">
            Total: {pilotos.length} pilotos
          </span>
        </div>
        
        {pilotos.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Nenhum piloto cadastrado.</p>
            <button
              onClick={resetForm}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Adicionar Primeiro Piloto
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nacionalidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nascimento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pilotos.map((piloto) => (
                  <tr key={piloto.id_piloto} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {piloto.foto_piloto_url ? (
                        <img 
                          src={piloto.foto_piloto_url} 
                          alt={piloto.nome_piloto}
                          className="h-12 w-12 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150?text=Sem+Foto';
                            e.target.className = 'h-12 w-12 rounded-full bg-gray-200';
                          }}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">Sem foto</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{piloto.nome_piloto}</div>
                      <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">{piloto.descricao_piloto}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{piloto.nacionalidade_piloto || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(piloto.data_nascimento_piloto)} 
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(piloto)}
                          className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md hover:bg-blue-50 transition duration-150"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(piloto.id_piloto)}
                          className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md hover:bg-red-50 transition duration-150"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PilotosCRUD;