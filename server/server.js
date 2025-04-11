require('dotenv').config();

const express = require('express');
const { poolPromise } = require('./utils/db'); 
const cors = require('cors');

const app = express();

// Configurações
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/temporadas', require('./routes/temporadaRoutes'));
app.use('/api/equipes', require('./routes/equipeRoutes'));
app.use('/api/pilotos', require('./routes/pilotoRoutes'));
app.use('/api/equipes-temporadas', require('./routes/equipeTemporadaRoutes'));
app.use('/api/pilotos-equipes-temporadas', require('./routes/pilotoEquipeTemporadaRoutes'));
app.use('/api/corridas', require('./routes/corridaRoutes'));
app.use('/api/resultados', require('./routes/resultadoRoutes'));
app.use('/api/campeoes', require('./routes/campeaoRoutes'));

// Rota de teste
app.get('/', (req, res) => {
    res.send('✅ API Rodando');
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await poolPromise; // Garante que a conexão com o banco está estabelecida
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Erro ao iniciar o servidor:', error);
        process.exit(1);
    }
}

startServer();