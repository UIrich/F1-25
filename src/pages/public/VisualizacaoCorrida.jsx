import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CorridaSelecionada = () => {
  const { id_temporada } = useParams();
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

        // 2. Busca as corridas específicas da temporada
        const corridasResponse = await axios.get(`http://localhost:3000/api/corridas/temporada/${id_temporada}`);

        // 3. Formata os dados das corridas
        const corridasFormatadas = corridasResponse.data.map(corrida => {
          const dataCorrida = new Date(corrida.data_corrida);
          return {
            id: corrida.id_corrida,
            nome: corrida.nome_corrida,
            local: corrida.local_corrida,
            data: dataCorrida.toLocaleDateString('pt-BR'),
            diaSemana: dataCorrida.toLocaleDateString('pt-BR', { weekday: 'long' }),
            mes: dataCorrida.toLocaleDateString('pt-BR', { month: 'long' }),
            ano: dataCorrida.getFullYear()
          };
        });

        // Ordena por data
        corridasFormatadas.sort((a, b) => new Date(a.data) - new Date(b.data));
        
        setCorridas(corridasFormatadas);
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
          Calendário {temporadaInfo?.id_temporada}ª Temporada
        </h1>
        <p className="text-gray-600 mt-2">
          {corridas.length} corrida{corridas.length !== 1 ? 's' : ''} programada{corridas.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-4">
        {corridas.map((corrida) => (
          <div key={corrida.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start">
                <div className="bg-gray-100 rounded-lg p-3 text-center mr-4 min-w-[70px]">
                  <div className="text-sm text-gray-500">{corrida.diaSemana.split('-')[0]}</div>
                  <div className="text-2xl font-bold">{new Date(corrida.data).getDate()}</div>
                  <div className="text-xs text-gray-500">{corrida.mes.split('de')[0]}</div>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800">{corrida.nome}</h2>
                  <p className="text-gray-600 mt-1">{corrida.local}</p>
                  <p className="text-gray-500 text-sm mt-2">{corrida.data}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
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

export default CorridaSelecionada;