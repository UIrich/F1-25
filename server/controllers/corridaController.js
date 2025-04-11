const Corrida = require('../models/corridaModel');

class CorridaController {
    static async GetCorridas(req, res) {
        try {
            const corridas = await Corrida.Get();
            return res.status(200).json(corridas);
        } catch (error) {
            console.error('Erro no controller (GetCorridas):', error);
            return res.status(500).json({ erro: 'Erro ao buscar corridas' });
        }
    }

    static async GetCorridaById(req, res) {
        try {
            const { id_corrida } = req.params;
            if (isNaN(id_corrida)) {
                return res.status(400).json({ erro: 'ID da corrida deve ser um número' });
            }
            
            const corrida = await Corrida.GetById(parseInt(id_corrida));
            if (!corrida) {
                return res.status(404).json({ erro: 'Corrida não encontrada' });
            }
            
            return res.status(200).json(corrida);
        } catch (error) {
            console.error('Erro no controller (GetCorridaById):', error);
            return res.status(500).json({ erro: 'Erro ao buscar corrida' });
        }
    }

    static async GetCorridasPorTemporada(req, res) {
        try {
            const { id_temporada } = req.params;
            
            if (isNaN(id_temporada)) {
                return res.status(400).json({ erro: 'ID da temporada deve ser um número' });
            }
            
            const corridas = await Corrida.GetByTemporada(parseInt(id_temporada));
            
            if (corridas.length === 0) {
                return res.status(404).json({ 
                    mensagem: 'Nenhuma corrida encontrada para esta temporada',
                    id_temporada
                });
            }
            
            return res.status(200).json(corridas);
        } catch (error) {
            console.error('Erro no controller (GetCorridasPorTemporada):', error);
            return res.status(500).json({ erro: 'Erro ao buscar corridas da temporada' });
        }
    }

    static async InsertCorrida(req, res) {
        try {
            const { id_temporada, nome_corrida, local_corrida, data_corrida } = req.body;
            
            if (!id_temporada || !nome_corrida || !local_corrida) {
                return res.status(400).json({ erro: 'ID da temporada, nome e local da corrida são obrigatórios' });
            }
            
            const rowsAffected = await Corrida.Insert(
                id_temporada, 
                nome_corrida, 
                local_corrida, 
                data_corrida
            );
            
            return res.status(201).json({ 
                mensagem: 'Corrida inserida com sucesso',
                rowsAffected
            });
        } catch (error) {
            console.error('Erro no controller (InsertCorrida):', error);
            return res.status(500).json({ erro: 'Erro ao inserir corrida' });
        }
    }

    static async UpdateCorrida(req, res) {
        try {
            const { id_corrida } = req.params;
            const { nome_corrida, local_corrida, data_corrida } = req.body;
            
            if (isNaN(id_corrida)) {
                return res.status(400).json({ erro: 'ID da corrida deve ser um número' });
            }
            
            if (!nome_corrida || !local_corrida) {
                return res.status(400).json({ erro: 'Nome e local da corrida são obrigatórios' });
            }
            
            const rowsAffected = await Corrida.Update(
                parseInt(id_corrida), 
                nome_corrida, 
                local_corrida, 
                data_corrida
            );
            
            if (rowsAffected > 0) {
                return res.status(200).json({ mensagem: 'Corrida atualizada com sucesso' });
            } else {
                return res.status(404).json({ erro: 'Corrida não encontrada' });
            }
        } catch (error) {
            console.error('Erro no controller (UpdateCorrida):', error);
            return res.status(500).json({ erro: 'Erro ao atualizar corrida' });
        }
    }

    static async DeleteCorrida(req, res) {
        try {
            const { id_corrida } = req.params;
            
            if (isNaN(id_corrida)) {
                return res.status(400).json({ erro: 'ID da corrida deve ser um número' });
            }
            
            const rowsAffected = await Corrida.Delete(parseInt(id_corrida));
            
            if (rowsAffected > 0) {
                return res.status(200).json({ mensagem: 'Corrida excluída com sucesso' });
            } else {
                return res.status(404).json({ erro: 'Corrida não encontrada' });
            }
        } catch (error) {
            console.error('Erro no controller (DeleteCorrida):', error);
            return res.status(500).json({ erro: 'Erro ao excluir corrida' });
        }
    }

    static async GetResultadosPorCorrida(req, res) {
        try {
            const { id_corrida } = req.params;
            
            if (isNaN(id_corrida)) {
                return res.status(400).json({ erro: 'ID da corrida deve ser um número' });
            }
            
            const resultados = await Corrida.GetResultados(parseInt(id_corrida));
            
            if (resultados.length === 0) {
                return res.status(404).json({ 
                    mensagem: 'Nenhum resultado encontrado para esta corrida',
                    id_corrida
                });
            }
            
            return res.status(200).json(resultados);
        } catch (error) {
            console.error('Erro no controller (GetResultadosPorCorrida):', error);
            return res.status(500).json({ erro: 'Erro ao buscar resultados da corrida' });
        }
    }
}

module.exports = CorridaController;