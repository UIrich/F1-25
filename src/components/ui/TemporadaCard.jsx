import React from 'react';
import { useNavigate } from 'react-router-dom';

const TemporadaCard = ({ temporada }) => {
  const navigate = useNavigate();

  // Função para formatar o ID como "Temporada #ID"
  const formatId = (id) => {
    return `Temporada #${id}`;
  };

  return (
    <div 
      className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md cursor-pointer transition-all"
      onClick={() => navigate(`/temporadas/${temporada.id_temporada}`)}
    >
      <div className="flex flex-col">
        {/* ID no topo */}
        <span className="text-sm font-medium text-gray-500">
          {formatId(temporada.id_temporada)}
        </span>
        
        {/* Ano em destaque */}
        <h3 className="text-xl font-bold text-gray-800 mt-1">
          {temporada.ano_temporada}
        </h3>
      </div>
      
      {/* Status no rodapé */}
      <div className="mt-3 pt-2 border-t">
        <span className={`text-xs px-2 py-1 rounded-full ${
          temporada.status_temporada === 'Ativa' 
            ? 'bg-green-100 text-green-800' 
            : temporada.status_temporada === 'Planejada'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
        }`}>
          {temporada.status_temporada}
        </span>
      </div>
    </div>
  );
};

export default TemporadaCard;