import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TemporadaCard from '../../components/ui/TemporadaCard';

const TemporadasPage = () => {
  const [temporadas, setTemporadas] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/temporadas')
      .then(response => {
        // Ordena por id_temporada (opcional, se não vier ordenado da API)
        const sorted = response.data.sort((a, b) => a.id_temporada - b.id_temporada);
        setTemporadas(sorted);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Temporadas</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {temporadas.map(temporada => (
          <TemporadaCard 
            key={temporada.id_temporada} 
            temporada={temporada} 
          />
        ))}
      </div>
    </div>
  );
};

export default TemporadasPage;