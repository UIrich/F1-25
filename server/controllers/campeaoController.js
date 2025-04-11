const Campeao = require('../models/campeaoModel');

class CampeaoController {
    static async GetCampeoes(req, res) {
        try {
            const campeoes = await Campeao.Get();
            return res.status(200).json(campeoes);
        } catch (error) {
            console.error('Erro no controller (GetCampeoes):', error);
            return res.status(500).json({ erro: 'Erro ao buscar campeões' });
        }
    }

    static async GetCampeaoById(req, res) {
        try {
            const { id_campeao } = req.params;
            if (isNaN(id_campeao)) {
                return res.status(400).json({ erro: 'ID do campeão deve ser um número' });
            }
            
            const campeao = await Campeao.GetById(parseInt(id_campeao));
            if (!campeao) {
                return res.status(404).json({ erro: 'Campeão não encontrado' });
            }
            
            return res.status(200).json(campeao);
        } catch (error) {
            console.error('Erro no controller (GetCampeaoById):', error);
            return res.status(500).json({ erro: 'Erro ao buscar campeão' });
        }
    }

    static async GetCampeoesPorTemporada(req, res) {
        try {
            const { id_temporada } = req.params;
            
            if (isNaN(id_temporada)) {
                return res.status(400).json({ erro: 'ID da temporada deve ser um número' });
            }
            
            const campeoes = await Campeao.GetByTemporada(parseInt(id_temporada));
            
            if (campeoes.length === 0) {
                return res.status(404).json({ 
                    mensagem: 'Nenhum campeão encontrado para esta temporada',
                    id_temporada
                });
            }
            
            return res.status(200).json(campeoes);
        } catch (error) {
            console.error('Erro no controller (GetCampeoesPorTemporada):', error);
            return res.status(500).json({ erro: 'Erro ao buscar campeões da temporada' });
        }
    }

    static async InsertCampeao(req, res) {
        try {
            const { id_temporada, id_piloto, id_equipe } = req.body;
            
            if (!id_temporada || (!id_piloto && !id_equipe)) {
                return res.status(400).json({ erro: 'ID da temporada e pelo menos um ID de piloto ou equipe são obrigatórios' });
            }
            
            const rowsAffected = await Campeao.Insert(
                id_temporada, 
                id_piloto, 
                id_equipe
            );
            
            return res.status(201).json({ 
                mensagem: 'Campeão inserido com sucesso',
                rowsAffected
            });
        } catch (error) {
            console.error('Erro no controller (InsertCampeao):', error);
            return res.status(500).json({ erro: 'Erro ao inserir campeão' });
        }
    }

    static async UpdateCampeao(req, res) {
        try {
            const { id_campeao } = req.params;
            const { id_piloto, id_equipe } = req.body;
            
            if (isNaN(id_campeao)) {
                return res.status(400).json({ erro: 'ID do campeão deve ser um número' });
            }
            
            if (!id_piloto && !id_equipe) {
                return res.status(400).json({ erro: 'Pelo menos um ID de piloto ou equipe deve ser fornecido para atualização' });
            }
            
            const rowsAffected = await Campeao.Update(
                parseInt(id_campeao), 
                id_piloto, 
                id_equipe
            );
            
            if (rowsAffected > 0) {
                return res.status(200).json({ mensagem: 'Campeão atualizado com sucesso' });
            } else {
                return res.status(404).json({ erro: 'Campeão não encontrado' });
            }
        } catch (error) {
            console.error('Erro no controller (UpdateCampeao):', error);
            return res.status(500).json({ erro: 'Erro ao atualizar campeão' });
        }
    }

    static async DeleteCampeao(req, res) {
        try {
            const { id_campeao } = req.params;
            
            if (isNaN(id_campeao)) {
                return res.status(400).json({ erro: 'ID do campeão deve ser um número' });
            }
            
            const rowsAffected = await Campeao.Delete(parseInt(id_campeao));
            
            if (rowsAffected > 0) {
                return res.status(200).json({ mensagem: 'Campeão excluído com sucesso' });
            } else {
                return res.status(404).json({ erro: 'Campeão não encontrado' });
            }
        } catch (error) {
            console.error('Erro no controller (DeleteCampeao):', error);
            return res.status(500).json({ erro: 'Erro ao excluir campeão' });
        }
    }
}

module.exports = CampeaoController;