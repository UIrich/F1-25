import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const PilotosSelecionado = () => {
  const { id_temporada } = useParams();
  const [pilotos, setPilotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPilotos = async () => {
      try {
        // Busca os pilotos da temporada
        const response = await axios.get(`http://localhost:3000/api/pilotos/temporada/${id_temporada}`);
        console.log('Dados completos dos pilotos:', response.data);
        
        // Formata a data de nascimento
        const pilotosFormatados = response.data.map(piloto => {
          const dataNascimento = new Date(piloto.data_nascimento_piloto);
          const idade = new Date().getFullYear() - dataNascimento.getFullYear();
          
          return {
            id: piloto.id_piloto,
            nome: piloto.nome_piloto,
            foto: piloto.foto_piloto_url,
            nacionalidade: piloto.nacionalidade_piloto,
            idade,
            descricao: piloto.descricao_piloto,
            dataNascimento: dataNascimento.toLocaleDateString('pt-BR')
          };
        });

        setPilotos(pilotosFormatados);
      } catch (error) {
        console.error('Erro ao buscar pilotos:', error);
        setError(error.response?.data?.erro || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPilotos();
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Pilotos da {id_temporada}° Temporada </h1>
      
      {pilotos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pilotos.map((piloto) => (
            <div key={piloto.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start">
                  <img 
                    src={piloto.foto} 
                    alt={piloto.nome}
                    className="w-20 h-20 object-cover rounded-full mr-4 border-2 border-gray-200"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{piloto.nome}</h2>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Nacionalidade:</span> {piloto.nacionalidade}</p>
                      <p><span className="font-medium">Idade:</span> {piloto.idade} anos</p>
                      <p><span className="font-medium">Nascimento:</span> {piloto.dataNascimento}</p>
                    </div>
                  </div>
                </div>
                {piloto.descricao && (
                  <p className="mt-4 text-gray-700 italic">"{piloto.descricao}"</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum piloto encontrado para esta temporada</p>
        </div>
      )}

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

export default PilotosSelecionado;