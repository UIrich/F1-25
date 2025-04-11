import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ResultadoSelecionado = () => {
  const { id_temporada } = useParams();
  const [resultados, setResultados] = useState([]);
  const [corridas, setCorridas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [temporadaInfo, setTemporadaInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Busca informações da temporada
        const tempResponse = await axios.get(`http://localhost:3000/api/temporadas/${id_temporada}`);
        setTemporadaInfo(tempResponse.data);

        // 2. Busca as corridas da temporada
        const corridasResponse = await axios.get(`http://localhost:3000/api/corridas/temporada/${id_temporada}`);
        setCorridas(corridasResponse.data);

        // 3. Busca todos os resultados
        const resultadosResponse = await axios.get('http://localhost:3000/api/resultados');
        
        // Filtra apenas os resultados da temporada selecionada
        const resultadosDaTemporada = resultadosResponse.data.filter(
          resultado => resultado.ano_temporada === tempResponse.data.ano_temporada
        );

        // Organiza os resultados por corrida
        const resultadosPorCorrida = corridasResponse.data.map(corrida => {
          const resultadosCorrida = resultadosDaTemporada.filter(
            resultado => resultado.id_corrida === corrida.id_corrida
          );
          
          return {
            id_corrida: corrida.id_corrida,
            nome_corrida: corrida.nome_corrida,
            data_corrida: corrida.data_corrida,
            local_corrida: corrida.local_corrida,
            resultados: resultadosCorrida.sort((a, b) => a.posicao_final - b.posicao_final)
          };
        });

        // Ordena corridas por data
        resultadosPorCorrida.sort((a, b) => new Date(a.data_corrida) - new Date(b.data_corrida));
        
        setResultados(resultadosPorCorrida);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_temporada]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Erro: {error}</p>
        <Link to={`/temporadas/${id_temporada}`} className="ml-4 text-blue-600 hover:underline">
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Resultados da Temporada {temporadaInfo?.ano_temporada || id_temporada}
        </h1>
        <p className="text-gray-600 mt-2">
          {corridas.length} corrida{corridas.length !== 1 ? 's' : ''} realizada{corridas.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-8">
        {resultados.map((corrida) => {
          const dataCorrida = new Date(corrida.data_corrida);
          const dataFormatada = dataCorrida.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
          
          return (
            <div key={corrida.id_corrida} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">{corrida.nome_corrida}</h2>
                  <p className="text-gray-600">{corrida.local_corrida}</p>
                  <p className="text-gray-500 text-sm mt-1">{dataFormatada}</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Piloto</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipe</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grid</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pontos</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {corrida.resultados.map((resultado) => {
                        // Calcula a diferença entre posição inicial e final
                        const diffPosicao = resultado.posicao_inicial - resultado.posicao_final;
                        let diffClass = '';
                        
                        if (diffPosicao > 0) {
                          diffClass = 'text-green-600'; // Ganhou posições
                        } else if (diffPosicao < 0) {
                          diffClass = 'text-red-600'; // Perdeu posições
                        }

                        return (
                          <tr key={resultado.id_resultado}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {resultado.posicao_final}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {resultado.nome_piloto}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {resultado.nome_equipe}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {resultado.posicao_inicial}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <span className={diffClass}>
                                {resultado.posicao_final}
                                {diffPosicao !== 0 && (
                                  <span className="ml-1 text-xs">
                                    ({diffPosicao > 0 ? `+${diffPosicao}` : diffPosicao})
                                  </span>
                                )}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {resultado.pontuacao}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${resultado.status_corrida === 'Completou' ? 'bg-green-100 text-green-800' : 
                                  resultado.status_corrida === 'Abandonou' ? 'bg-red-100 text-red-800' : 
                                  'bg-yellow-100 text-yellow-800'}`}>
                                {resultado.status_corrida}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Link 
          to={`/temporadas/${id_temporada}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para a temporada
        </Link>
      </div>
    </div>
  );
};

export default ResultadoSelecionado;