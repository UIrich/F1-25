import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/resultados';

function ResultadosCRUD() {
  const [resultados, setResultados] = useState([]);
  const [corridas, setCorridas] = useState([]);
  const [pilotosEquipes, setPilotosEquipes] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  const [formData, setFormData] = useState({
    id_corrida: '',
    id_piloto_equipe_temporada: '',
    posicao_inicial: '',
    posicao_final: '',
    pontuacao: '',
    status_corrida: 'Completou'
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filtroTemporada, setFiltroTemporada] = useState('');
  const [filtroCorrida, setFiltroCorrida] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (filtroTemporada) {
      setFiltroCorrida('');
    }
  }, [filtroTemporada]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [resultadosRes, corridasRes, pilotosEquipesRes, temporadasRes] = await Promise.all([
        axios.get(API_URL),
        axios.get('http://localhost:3000/api/corridas'),
        axios.get('http://localhost:3000/api/pilotos-equipes-temporadas'),
        axios.get('http://localhost:3000/api/temporadas')
      ]);
      
      setResultados(resultadosRes.data);
      setCorridas(corridasRes.data);
      setPilotosEquipes(pilotosEquipesRes.data);
      setTemporadas(temporadasRes.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar dados');
      setLoading(false);
    }
  };

  const resultadosFiltrados = resultados.filter(r => {
    const corrida = corridas.find(c => c.id_corrida === r.id_corrida);
    if (!corrida) return false;
    
    const matchTemporada = filtroTemporada === '' || 
      corrida.id_temporada.toString() === filtroTemporada;
    const matchCorrida = filtroCorrida === '' || 
      r.id_corrida.toString() === filtroCorrida;
    
    return matchTemporada && matchCorrida;
  });

  const corridasDisponiveis = filtroTemporada
    ? corridas.filter(c => c.id_temporada.toString() === filtroTemporada)
    : corridas;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        pontuacao: formData.pontuacao ? parseFloat(formData.pontuacao) : null
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
        setSuccessMessage('Resultado atualizado com sucesso!');
      } else {
        await axios.post(API_URL, payload);
        setSuccessMessage('Resultado criado com sucesso!');
      }
      
      fetchData();
      resetForm();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao salvar resultado');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este resultado?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setSuccessMessage('Resultado excluído com sucesso!');
        fetchData();
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        setError('Erro ao excluir resultado');
      }
    }
  };

  const handleEdit = (resultado) => {
    setFormData({
      id_corrida: resultado.id_corrida,
      id_piloto_equipe_temporada: resultado.id_piloto_equipe_temporada,
      posicao_inicial: resultado.posicao_inicial,
      posicao_final: resultado.posicao_final,
      pontuacao: resultado.pontuacao || '',
      status_corrida: resultado.status_corrida
    });
    setEditingId(resultado.id_resultado);
  };

  const resetForm = () => {
    setFormData({
      id_corrida: '',
      id_piloto_equipe_temporada: '',
      posicao_inicial: '',
      posicao_final: '',
      pontuacao: '',
      status_corrida: 'Completou'
    });
    setEditingId(null);
    setError(null);
  };

  if (loading) return <div className="p-4">Carregando...</div>;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Resultados</h1>
      
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
          {editingId ? `Editando Resultado #${editingId}` : 'Novo Resultado'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Corrida*</label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.id_corrida}
                onChange={(e) => setFormData({...formData, id_corrida: e.target.value})}
                required
              >
                <option value="">Selecione uma corrida</option>
                {corridas.map(corrida => (
                  <option key={corrida.id_corrida} value={corrida.id_corrida}>
                    {corrida.nome_corrida} ({corrida.local_corrida})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Piloto/Equipe*</label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.id_piloto_equipe_temporada}
                onChange={(e) => setFormData({...formData, id_piloto_equipe_temporada: e.target.value})}
                required
              >
                <option value="">Selecione um piloto/equipe</option>
                {pilotosEquipes.map(pe => (
                  <option key={pe.id_piloto_equipe_temporada} value={pe.id_piloto_equipe_temporada}>
                    {pe.nome_piloto} - {pe.nome_equipe} ({pe.ano_temporada})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Posição Inicial*</label>
              <input
                type="number"
                min="1"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.posicao_inicial}
                onChange={(e) => setFormData({...formData, posicao_inicial: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Posição Final*</label>
              <input
                type="number"
                min="1"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.posicao_final}
                onChange={(e) => setFormData({...formData, posicao_final: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pontuação</label>
              <input
                type="number"
                step="0.1"
                min="0"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.pontuacao}
                onChange={(e) => setFormData({...formData, pontuacao: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.status_corrida}
                onChange={(e) => setFormData({...formData, status_corrida: e.target.value})}
                required
              >
                <option value="Completou">Completou</option>
                <option value="Abandonou">Abandonou</option>
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
              {editingId ? 'Atualizar Resultado' : 'Cadastrar Resultado'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
        <div className="p-4 flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
          <h2 className="text-lg font-semibold">Lista de Resultados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full md:w-auto">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Temporada:</label>
              <select
                className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-grow"
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
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Corrida:</label>
              <select
                className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-grow"
                value={filtroCorrida}
                onChange={(e) => setFiltroCorrida(e.target.value)}
                disabled={!filtroTemporada && corridasDisponiveis.length === 0}
              >
                <option value="">Todas</option>
                {corridasDisponiveis.map(c => (
                  <option key={c.id_corrida} value={c.id_corrida}>
                    {c.nome_corrida}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Corrida</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Piloto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pontos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resultadosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                    Nenhum resultado encontrado
                  </td>
                </tr>
              ) : (
                resultadosFiltrados.map(resultado => {
                  const corrida = corridas.find(c => c.id_corrida === resultado.id_corrida);
                  const pilotoEquipe = pilotosEquipes.find(pe => pe.id_piloto_equipe_temporada === resultado.id_piloto_equipe_temporada);
                  
                  return (
                    <tr key={resultado.id_resultado} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{resultado.id_resultado}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {corrida ? `${corrida.nome_corrida} (${corrida.local_corrida})` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {pilotoEquipe ? pilotoEquipe.nome_piloto : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {pilotoEquipe ? pilotoEquipe.nome_equipe : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{resultado.posicao_inicial}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{resultado.posicao_final}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{resultado.pontuacao || '0'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          resultado.status_corrida === 'Completou' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {resultado.status_corrida}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleEdit(resultado)}
                          className="text-blue-600 hover:text-blue-900 hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(resultado.id_resultado)}
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

export default ResultadosCRUD;