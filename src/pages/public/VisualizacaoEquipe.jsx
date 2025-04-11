import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const EquipeSelecionada = () => {
  const { id_temporada } = useParams();
  const [equipes, setEquipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipes = async () => {
      try {
        // 1. Busca as relações equipe-temporada
        const response = await axios.get(`http://localhost:3000/api/equipes-temporadas/temporada/${id_temporada}`);
        console.log('Relações:', response.data);

        // 2. Verifica se é array ou objeto único
        const relacoes = Array.isArray(response.data) ? response.data : [response.data];
        
        // 3. Busca os detalhes de cada equipe
        const equipesDetalhadas = await Promise.all(
          relacoes.map(async (relacao) => {
            const equipeResponse = await axios.get(`http://localhost:3000/api/equipes/${relacao.id_equipe}`);
            return {
              id: relacao.id_equipe,
              nome: equipeResponse.data.nome_equipe, // Usando nome_equipe
              logo: equipeResponse.data.logo_equipe_url,
              descricao: equipeResponse.data.descricao_equipe
            };
          })
        );

        setEquipes(equipesDetalhadas);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipes();
  }, [id_temporada]);

  if (loading) {
    return <div className="p-4">Carregando equipes...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Equipes da Temporada {id_temporada}</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {equipes.map((equipe) => (
          <div key={equipe.id} className="border p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              {equipe.logo && (
                <img 
                  src={equipe.logo} 
                  alt={equipe.nome}
                  className="w-16 h-16 object-contain mr-4"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold">{equipe.nome}</h2>
                <p className="text-gray-600 text-sm">{equipe.descricao}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link 
        to={`/temporadas/${id_temporada}`}
        className="mt-6 inline-block text-blue-600 hover:underline"
      >
        Voltar para a temporada
      </Link>
    </div>
  );
};

export default EquipeSelecionada;