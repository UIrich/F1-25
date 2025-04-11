import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CampeaoSelecionado = () => {
  const { id_temporada } = useParams();
  const [campeoesPilotos, setCampeoesPilotos] = useState([]);
  const [campeoesEquipes, setCampeoesEquipes] = useState([]);
  const [temporada, setTemporada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Busca informações da temporada
        const tempResponse = await axios.get(`http://localhost:3000/api/temporadas/${id_temporada}`);
        setTemporada(tempResponse.data);

        // 2. Busca os campeões da temporada
        const campeoesResponse = await axios.get(`http://localhost:3000/api/campeoes/temporada/${id_temporada}`);
        
        // Separa campeões de pilotos e equipes
        const pilotos = campeoesResponse.data.filter(c => c.id_piloto);
        const equipes = campeoesResponse.data.filter(c => c.id_equipe);
        
        setCampeoesPilotos(pilotos);
        setCampeoesEquipes(equipes);
        
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
        <Link to="/campeoes" className="ml-4 text-blue-600 hover:underline">
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Campeões da {temporada?.id_temporada}ª Temporada ({temporada?.ano_temporada})
        </h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Seção de Campeão de Pilotos */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 px-6 py-3">
            <h2 className="text-xl font-semibold text-white">Campeão Mundial de Pilotos</h2>
          </div>
          <div className="p-6">
            {campeoesPilotos.length > 0 ? (
              campeoesPilotos.map(campeao => (
                <div key={campeao.id_campeao} className="flex items-center space-x-4 mb-4 last:mb-0">
                  <div className="bg-yellow-100 rounded-full p-2">
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-800">{campeao.nome_piloto}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum campeão de pilotos</p>
            )}
          </div>
        </div>

        {/* Seção de Campeão de Construtores */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-red-600 px-6 py-3">
            <h2 className="text-xl font-semibold text-white">Campeão Mundial de Construtores</h2>
          </div>
          <div className="p-6">
            {campeoesEquipes.length > 0 ? (
              campeoesEquipes.map(campeao => (
                <div key={campeao.id_campeao} className="flex items-center space-x-4 mb-4 last:mb-0">
                  <div className="bg-yellow-100 rounded-full p-2">
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-800">{campeao.nome_equipe}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum campeão de construtores</p>
            )}
          </div>
        </div>
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

export default CampeaoSelecionado;