import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/campeoes';

function CampeoesCRUD() {
  const [campeoes, setCampeoes] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  const [pilotos, setPilotos] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const [formData, setFormData] = useState({
    id_temporada: '',
    id_piloto: '',
    id_equipe: '',
    ano_campeao: ''
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
      
      const [campeoesRes, temporadasRes, pilotosRes, equipesRes] = await Promise.all([
        axios.get(API_URL),
        axios.get('http://localhost:3000/api/temporadas'),
        axios.get('http://localhost:3000/api/pilotos'),
        axios.get('http://localhost:3000/api/equipes')
      ]);
      
      setCampeoes(campeoesRes.data);
      setTemporadas(temporadasRes.data);
      setPilotos(pilotosRes.data);
      setEquipes(equipesRes.data);
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
        ano_campeao: formData.ano_campeao || null
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
        setSuccessMessage('Campeão atualizado com sucesso!');
      } else {
        await axios.post(API_URL, payload);
        setSuccessMessage('Campeão criado com sucesso!');
      }
      
      fetchData();
      resetForm();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao salvar campeão');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de campeão?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setSuccessMessage('Registro de campeão excluído com sucesso!');
        fetchData();
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        setError('Erro ao excluir registro de campeão');
      }
    }
  };

  const handleEdit = (campeao) => {
    setFormData({
      id_temporada: campeao.id_temporada,
      id_piloto: campeao.id_piloto || '',
      id_equipe: campeao.id_equipe || '',
      ano_campeao: campeao.ano_campeao || ''
    });
    setEditingId(campeao.id_campeao);
  };

  const resetForm = () => {
    setFormData({
      id_temporada: '',
      id_piloto: '',
      id_equipe: '',
      ano_campeao: ''
    });
    setEditingId(null);
    setError(null);
  };

  if (loading) return <div className="p-4">Carregando...</div>;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Campeões</h1>
      
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
          {editingId ? `Editando Campeão #${editingId}` : 'Novo Campeão'}
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
                    {temporada.ano_temporada} ({temporada.id_temporada}° Temporada)
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Piloto Campeão</label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.id_piloto}
                onChange={(e) => setFormData({...formData, id_piloto: e.target.value})}
              >
                <option value="">Nenhum piloto</option>
                {pilotos.map(piloto => (
                  <option key={piloto.id_piloto} value={piloto.id_piloto}>
                    {piloto.nome_piloto}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equipe Campeã</label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.id_equipe}
                onChange={(e) => setFormData({...formData, id_equipe: e.target.value})}
              >
                <option value="">Nenhuma equipe</option>
                {equipes.map(equipe => (
                  <option key={equipe.id_equipe} value={equipe.id_equipe}>
                    {equipe.nome_equipe}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ano do Título</label>
              <input
                type="number"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.ano_campeao}
                onChange={(e) => setFormData({...formData, ano_campeao: e.target.value})}
                placeholder="Opcional - preenchimento automático"
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
              {editingId ? 'Atualizar Campeão' : 'Cadastrar Campeão'}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temporada</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Piloto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ano</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campeoes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Nenhum campeão cadastrado
                  </td>
                </tr>
              ) : (
                campeoes.map(campeao => {
                  const temporada = temporadas.find(t => t.id_temporada === campeao.id_temporada);
                  const piloto = pilotos.find(p => p.id_piloto === campeao.id_piloto);
                  const equipe = equipes.find(e => e.id_equipe === campeao.id_equipe);
                  
                  return (
                    <tr key={campeao.id_campeao} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{campeao.id_campeao}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {campeao.id_temporada || 'N/A'}°
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {piloto ? piloto.nome_piloto : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {equipe ? equipe.nome_equipe : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {temporada ? temporada.ano_temporada : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleEdit(campeao)}
                          className="text-blue-600 hover:text-blue-900 hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(campeao.id_campeao)}
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

export default CampeoesCRUD;