const EquipeTemporada = require('../models/equipeTemporadaModel');

class EquipeTemporadaController {
    static async GetEquipesTemporadas(req, res) {
        try {
            const equipesTemporadas = await EquipeTemporada.Get();
            return res.status(200).json(equipesTemporadas);
        } catch (error) {
            console.error('Erro no controller (GetEquipesTemporadas):', error);
            return res.status(500).json({ erro: 'Erro ao buscar equipes por temporada' });
        }
    }

    static async GetEquipeTemporadaById(req, res) {
        try {
            const { id_equipe_temporada } = req.params;
            if (isNaN(id_equipe_temporada)) {
                return res.status(400).json({ erro: 'ID da relação equipe/temporada deve ser um número' });
            }
            
            const equipeTemporada = await EquipeTemporada.GetById(parseInt(id_equipe_temporada));
            if (!equipeTemporada) {
                return res.status(404).json({ erro: 'Relação equipe/temporada não encontrada' });
            }
            
            return res.status(200).json(equipeTemporada);
        } catch (error) {
            console.error('Erro no controller (GetEquipeTemporadaById):', error);
            return res.status(500).json({ erro: 'Erro ao buscar relação equipe/temporada' });
        }
    }

    static async GetEquipesPorTemporada(req, res) {
        try {
            const { id_temporada } = req.params;
            
            if (isNaN(id_temporada)) {
                return res.status(400).json({ erro: 'ID da temporada deve ser um número' });
            }
            
            const equipesTemporada = await EquipeTemporada.GetByTemporada(parseInt(id_temporada));
            
            if (equipesTemporada.length === 0) {
                return res.status(404).json({ 
                    mensagem: 'Nenhuma equipe encontrada para esta temporada',
                    id_temporada
                });
            }
            
            return res.status(200).json(equipesTemporada);
        } catch (error) {
            console.error('Erro no controller (GetEquipesPorTemporada):', error);
            return res.status(500).json({ erro: 'Erro ao buscar equipes da temporada' });
        }
    }

    static async InsertEquipeTemporada(req, res) {
        try {
            const { id_equipe, id_temporada } = req.body;
            
            if (!id_equipe || !id_temporada) {
                return res.status(400).json({ erro: 'ID da equipe e ID da temporada são obrigatórios' });
            }
            
            const rowsAffected = await EquipeTemporada.Insert(id_equipe, id_temporada);
            
            return res.status(201).json({ 
                mensagem: 'Equipe vinculada à temporada com sucesso',
                rowsAffected
            });
        } catch (error) {
            console.error('Erro no controller (InsertEquipeTemporada):', error);
            return res.status(500).json({ erro: 'Erro ao vincular equipe à temporada' });
        }
    }

    static async DeleteEquipeTemporada(req, res) {
        try {
            const { id_equipe_temporada } = req.params;
            
            if (isNaN(id_equipe_temporada)) {
                return res.status(400).json({ erro: 'ID da relação equipe/temporada deve ser um número' });
            }
            
            const rowsAffected = await EquipeTemporada.Delete(parseInt(id_equipe_temporada));
            
            if (rowsAffected > 0) {
                return res.status(200).json({ mensagem: 'Relação equipe/temporada removida com sucesso' });
            } else {
                return res.status(404).json({ erro: 'Relação equipe/temporada não encontrada' });
            }
        } catch (error) {
            console.error('Erro no controller (DeleteEquipeTemporada):', error);
            return res.status(500).json({ erro: 'Erro ao remover equipe da temporada' });
        }
    }
}

module.exports = EquipeTemporadaController;