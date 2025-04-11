import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TemporadaSelecionada = () => {
  const { id_temporada } = useParams();
  const [temporada, setTemporada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemporada = async () => {
      try {
        const response = await axios.get(`/api/temporadas/${id_temporada}`);
        setTemporada(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id_temporada) {
      fetchTemporada();
    }
  }, [id_temporada]);

  const formatarTituloTemporada = () => {
    if (!temporada) return 'Temporada';
    return `${id_temporada}ª Temporada${temporada.ano_temporada ? ` - ${temporada.ano_temporada}` : ''}`;
  };

  if (!id_temporada) {
    return <div className="flex justify-center items-center h-64">
      <p className="text-xl text-gray-600">Selecione uma temporada</p>
    </div>;
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64">
      <p className="text-red-500">Erro ao carregar temporada: {error}</p>
    </div>;
  }

  // Ícones SVG inline
  const EquipesIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  const PilotosIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const CorridasIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );

  const ResultadosIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );

  const CampeoesIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );

  const cards = [
    {
      title: "Equipes",
      description: "Veja todas as equipes desta temporada",
      icon: <EquipesIcon />,
      link: `/temporadas/${id_temporada}/equipes`,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Pilotos",
      description: "Confira os pilotos participantes",
      icon: <PilotosIcon />,
      link: `/temporadas/${id_temporada}/pilotos`,
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Corridas",
      description: "Calendário de corridas da temporada",
      icon: <CorridasIcon />,
      link: `/temporadas/${id_temporada}/corridas`,
      bgColor: "bg-red-50",
      textColor: "text-red-600"
    },
    {
      title: "Resultados",
      description: "Resultados de cada corrida",
      icon: <ResultadosIcon />,
      link: `/temporadas/${id_temporada}/resultados`,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "Campeões",
      description: "Campeões da temporada",
      icon: <CampeoesIcon />,
      link: `/temporadas/${id_temporada}/campeoes`,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          {formatarTituloTemporada()}
        </h1>
        {temporada.status_temporada && (
          <p className="text-lg text-gray-600 mt-2">
            Status: {temporada.status_temporada}
          </p>
        )}
        {temporada.data_inicio_temporada && temporada.data_fim_temporada && (
          <p className="text-gray-500 mt-1">
            Período: {new Date(temporada.data_inicio_temporada).toLocaleDateString()} a {new Date(temporada.data_fim_temporada).toLocaleDateString()}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {cards.map((card, index) => (
          <Link to={card.link} key={index} className="transform transition-all hover:scale-105 hover:shadow-lg">
            <div className={`rounded-lg shadow-md p-6 h-full flex flex-col ${card.bgColor}`}>
              <div className={`w-12 h-12 flex items-center justify-center rounded-full ${card.textColor} mb-4`}>
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{card.title}</h3>
              <p className="text-gray-600 flex-grow">{card.description}</p>
              <div className="mt-4 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                Ver detalhes →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TemporadaSelecionada;