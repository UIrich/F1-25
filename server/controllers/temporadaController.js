const Temporada = require('../models/temporadaModel');

class TemporadaController {
    static async GetTemporadas(req, res) {
        try {
            const temporadas = await Temporada.Get();
            return res.status(200).json(temporadas);
        } catch (error) {
            console.error('Erro no controller (GetTemporadas):', error);
            return res.status(500).json({ erro: 'Erro ao buscar temporadas' });
        }
    }

    static async GetTemporadaById(req, res) {
        try {
            const { id_temporada } = req.params;
            if (isNaN(id_temporada)) {
                return res.status(400).json({ erro: 'ID da temporada deve ser um número' });
            }
            
            const temporada = await Temporada.GetById(parseInt(id_temporada));
            if (!temporada) {
                return res.status(404).json({ erro: 'Temporada não encontrada' });
            }
            
            return res.status(200).json(temporada);
        } catch (error) {
            console.error('Erro no controller (GetTemporadaById):', error);
            return res.status(500).json({ erro: 'Erro ao buscar temporada' });
        }
    }

    static async GetTemporadaByYear(req, res) {
        try {
            const { ano_temporada } = req.params;
            if (isNaN(ano_temporada)) {
                return res.status(400).json({ erro: 'Ano da temporada deve ser um número' });
            }
            
            const temporada = await Temporada.GetByYear(parseInt(ano_temporada));
            if (!temporada) {
                return res.status(404).json({ erro: 'Temporada não encontrada' });
            }
            
            return res.status(200).json(temporada);
        } catch (error) {
            console.error('Erro no controller (GetTemporadaByYear):', error);
            return res.status(500).json({ erro: 'Erro ao buscar temporada por ano' });
        }
    }

    static async InsertTemporada(req, res) {
        try {
            const { ano_temporada, status_temporada, data_inicio_temporada, data_fim_temporada, foto_temporada_url } = req.body;
            
            if (!ano_temporada) {
                return res.status(400).json({ erro: 'Ano da temporada é obrigatório' });
            }
            
            const rowsAffected = await Temporada.Insert(
                ano_temporada, 
                status_temporada || 'Ativa', 
                data_inicio_temporada, 
                data_fim_temporada, 
                foto_temporada_url
            );
            
            return res.status(201).json({ 
                mensagem: 'Temporada inserida com sucesso',
                rowsAffected
            });
        } catch (error) {
            console.error('Erro no controller (InsertTemporada):', error);
            return res.status(500).json({ erro: 'Erro ao inserir temporada' });
        }
    }

    static async UpdateTemporada(req, res) {
        try {
            const { id_temporada } = req.params;
            const { ano_temporada, status_temporada, data_inicio_temporada, data_fim_temporada, foto_temporada_url } = req.body;
            
            if (isNaN(id_temporada)) {
                return res.status(400).json({ erro: 'ID da temporada deve ser um número' });
            }
            
            const rowsAffected = await Temporada.Update(
                parseInt(id_temporada), 
                ano_temporada, 
                status_temporada, 
                data_inicio_temporada, 
                data_fim_temporada, 
                foto_temporada_url
            );
            
            if (rowsAffected > 0) {
                return res.status(200).json({ mensagem: 'Temporada atualizada com sucesso' });
            } else {
                return res.status(404).json({ erro: 'Temporada não encontrada' });
            }
        } catch (error) {
            console.error('Erro no controller (UpdateTemporada):', error);
            return res.status(500).json({ erro: 'Erro ao atualizar temporada' });
        }
    }

    static async DeleteTemporada(req, res) {
        try {
            const { id_temporada } = req.params;
            
            if (isNaN(id_temporada)) {
                return res.status(400).json({ erro: 'ID da temporada deve ser um número' });
            }
            
            const rowsAffected = await Temporada.Delete(parseInt(id_temporada));
            
            if (rowsAffected > 0) {
                return res.status(200).json({ mensagem: 'Temporada excluída com sucesso' });
            } else {
                return res.status(404).json({ erro: 'Temporada não encontrada' });
            }
        } catch (error) {
            console.error('Erro no controller (DeleteTemporada):', error);
            return res.status(500).json({ erro: 'Erro ao excluir temporada' });
        }
    }

    static async GetCorridasPorTemporada(req, res) {
        try {
            const { id_temporada } = req.params;
            
            if (isNaN(id_temporada)) {
                return res.status(400).json({ erro: 'ID da temporada deve ser um número' });
            }
            
            const corridas = await Temporada.GetCorridasPorTemporada(parseInt(id_temporada));
            
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
}

module.exports = TemporadaController;