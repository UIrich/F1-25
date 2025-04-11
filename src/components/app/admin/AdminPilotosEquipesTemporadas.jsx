import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/pilotos-equipes-temporadas';

function PilotosEquipesTemporadasCRUD() {
  const [relacoes, setRelacoes] = useState([]);
  const [pilotos, setPilotos] = useState([]);
  const [equipesTemporadas, setEquipesTemporadas] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  const [formData, setFormData] = useState({
    id_piloto: '',
    id_equipe_temporada: '',
    numero_carro: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filtroTemporada, setFiltroTemporada] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [relacoesRes, pilotosRes, equipesTemporadasRes, temporadasRes] = await Promise.all([
        axios.get(API_URL),
        axios.get('http://localhost:3000/api/pilotos'),
        axios.get('http://localhost:3000/api/equipes-temporadas'),
        axios.get('http://localhost:3000/api/temporadas')
      ]);
      
      setRelacoes(relacoesRes.data);
      setPilotos(pilotosRes.data);
      setEquipesTemporadas(equipesTemporadasRes.data);
      setTemporadas(temporadasRes.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar dados');
      setLoading(false);
    }
  };

  const relacoesFiltradas = filtroTemporada === ''
    ? relacoes
    : relacoes.filter(r => {
        const et = equipesTemporadas.find(e => e.id_equipe_temporada === r.id_equipe_temporada);
        return et && et.id_temporada.toString() === filtroTemporada;
      });

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
      id_piloto: relacao.id_piloto,
      id_equipe_temporada: relacao.id_equipe_temporada,
      numero_carro: relacao.numero_carro
    });
    setEditingId(relacao.id_piloto_equipe_temporada);
  };

  const resetForm = () => {
    setFormData({
      id_piloto: '',
      id_equipe_temporada: '',
      numero_carro: ''
    });
    setEditingId(null);
    setError(null);
  };

  if (loading) return <div className="p-4">Carregando...</div>;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Pilotos por Equipe/Temporada</h1>
      
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Piloto*</label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.id_piloto}
                onChange={(e) => setFormData({...formData, id_piloto: e.target.value})}
                required
              >
                <option value="">Selecione um piloto</option>
                {pilotos.map(piloto => (
                  <option key={piloto.id_piloto} value={piloto.id_piloto}>
                    {piloto.nome_piloto}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equipe/Temporada*</label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.id_equipe_temporada}
                onChange={(e) => setFormData({...formData, id_equipe_temporada: e.target.value})}
                required
              >
                <option value="">Selecione uma equipe/temporada</option>
                {equipesTemporadas.map(et => (
                  <option key={et.id_equipe_temporada} value={et.id_equipe_temporada}>
                    {et.nome_equipe} - {et.ano_temporada}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número do Carro*</label>
              <input
                type="number"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.numero_carro}
                onChange={(e) => setFormData({...formData, numero_carro: e.target.value})}
                required
                min="1"
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
              {editingId ? 'Atualizar Relação' : 'Cadastrar Relação'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Lista de Relações</h2>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Filtrar por temporada:</label>
            <select
              className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filtroTemporada}
              onChange={(e) => setFiltroTemporada(e.target.value)}
            >
              <option value="">Todas</option>
              {temporadas.map(t => (
                <option key={t.id_temporada} value={t.id_temporada}>
                  {t.ano_temporada}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Piloto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temporada</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {relacoesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Nenhuma relação encontrada
                  </td>
                </tr>
              ) : (
                relacoesFiltradas.map(relacao => {
                  const piloto = pilotos.find(p => p.id_piloto === relacao.id_piloto);
                  const equipeTemporada = equipesTemporadas.find(et => et.id_equipe_temporada === relacao.id_equipe_temporada);
                  
                  return (
                    <tr key={relacao.id_piloto_equipe_temporada} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{relacao.id_piloto_equipe_temporada}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {piloto ? piloto.nome_piloto : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {equipeTemporada ? equipeTemporada.nome_equipe : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {equipeTemporada ? equipeTemporada.ano_temporada : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{relacao.numero_carro}</td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleEdit(relacao)}
                          className="text-blue-600 hover:text-blue-900 hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(relacao.id_piloto_equipe_temporada)}
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

export default PilotosEquipesTemporadasCRUD;