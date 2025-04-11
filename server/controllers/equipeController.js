const Equipe = require('../models/equipeModel');

class EquipeController {
    static async GetEquipes(req, res) {
        try {
            const equipes = await Equipe.Get();
            return res.status(200).json(equipes);
        } catch (error) {
            console.error('Erro no controller (GetEquipes):', error);
            return res.status(500).json({ erro: 'Erro ao buscar equipes' });
        }
    }

    static async GetEquipeById(req, res) {
        try {
            const { id_equipe } = req.params;
            if (isNaN(id_equipe)) {
                return res.status(400).json({ erro: 'ID da equipe deve ser um número' });
            }
            
            const equipe = await Equipe.GetById(parseInt(id_equipe));
            if (!equipe) {
                return res.status(404).json({ erro: 'Equipe não encontrada' });
            }
            
            return res.status(200).json(equipe);
        } catch (error) {
            console.error('Erro no controller (GetEquipeById):', error);
            return res.status(500).json({ erro: 'Erro ao buscar equipe' });
        }
    }

    static async GetEquipesPorTemporada(req, res) {
        try {
            const { id_temporada } = req.params;
            
            if (isNaN(id_temporada)) {
                return res.status(400).json({ erro: 'ID da temporada deve ser um número' });
            }
            
            const equipes = await Equipe.GetByTemporada(parseInt(id_temporada));
            
            if (equipes.length === 0) {
                return res.status(404).json({ 
                    mensagem: 'Nenhuma equipe encontrada para esta temporada',
                    id_temporada
                });
            }
            
            return res.status(200).json(equipes);
        } catch (error) {
            console.error('Erro no controller (GetEquipesPorTemporada):', error);
            return res.status(500).json({ erro: 'Erro ao buscar equipes da temporada' });
        }
    }

    static async InsertEquipe(req, res) {
        try {
            const { nome_equipe, fundacao_equipe, logo_equipe_url, descricao_equipe } = req.body;
            
            if (!nome_equipe) {
                return res.status(400).json({ erro: 'Nome da equipe é obrigatório' });
            }
            
            const rowsAffected = await Equipe.Insert(
                nome_equipe, 
                fundacao_equipe, 
                logo_equipe_url, 
                descricao_equipe
            );
            
            return res.status(201).json({ 
                mensagem: 'Equipe inserida com sucesso',
                rowsAffected
            });
        } catch (error) {
            console.error('Erro no controller (InsertEquipe):', error);
            return res.status(500).json({ erro: 'Erro ao inserir equipe' });
        }
    }

    static async UpdateEquipe(req, res) {
        try {
            const { id_equipe } = req.params;
            const { nome_equipe, fundacao_equipe, logo_equipe_url, descricao_equipe } = req.body;
            
            if (isNaN(id_equipe)) {
                return res.status(400).json({ erro: 'ID da equipe deve ser um número' });
            }
            
            if (!nome_equipe) {
                return res.status(400).json({ erro: 'Nome da equipe é obrigatório' });
            }
            
            const rowsAffected = await Equipe.Update(
                parseInt(id_equipe), 
                nome_equipe, 
                fundacao_equipe, 
                logo_equipe_url, 
                descricao_equipe
            );
            
            if (rowsAffected > 0) {
                return res.status(200).json({ mensagem: 'Equipe atualizada com sucesso' });
            } else {
                return res.status(404).json({ erro: 'Equipe não encontrada' });
            }
        } catch (error) {
            console.error('Erro no controller (UpdateEquipe):', error);
            return res.status(500).json({ erro: 'Erro ao atualizar equipe' });
        }
    }

    static async DeleteEquipe(req, res) {
        try {
            const { id_equipe } = req.params;
            
            if (isNaN(id_equipe)) {
                return res.status(400).json({ erro: 'ID da equipe deve ser um número' });
            }
            
            const rowsAffected = await Equipe.Delete(parseInt(id_equipe));
            
            if (rowsAffected > 0) {
                return res.status(200).json({ mensagem: 'Equipe excluída com sucesso' });
            } else {
                return res.status(404).json({ erro: 'Equipe não encontrada' });
            }
        } catch (error) {
            console.error('Erro no controller (DeleteEquipe):', error);
            return res.status(500).json({ erro: 'Erro ao excluir equipe' });
        }
    }
}

module.exports = EquipeController;