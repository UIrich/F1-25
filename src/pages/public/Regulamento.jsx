import React from 'react';

const Regulamento = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cabeçalho */}
      <header className="bg-blue-800 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Regulamento</h1>
          <p className="mt-2">Conheça as regras e normas da competição</p>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Regras Gerais</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-medium">1. Conduta dos Participantes</h3>
              <p className="mt-2 text-gray-700">
                Todos os pilotos devem manter conduta esportiva e respeitosa durante as competições.
                Comportamentos antidesportivos serão penalizados.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-medium">2. Sistema de Pontuação</h3>
              <p className="mt-2 text-gray-700">
                A pontuação será distribuída conforme tabela oficial: 1º lugar - 25 pontos, 
                2º lugar - 18 pontos, 3º lugar - 15 pontos, e assim por diante.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-medium">3. Penalidades</h3>
              <p className="mt-2 text-gray-700">
                Infrações às regras podem resultar em penalidades de tempo, perda de pontos 
                ou até desqualificação da temporada, dependendo da gravidade.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="bg-gray-800 text-white py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2023 Competição de Corridas. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Regulamento;