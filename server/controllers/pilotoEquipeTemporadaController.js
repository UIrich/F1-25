const PilotoEquipeTemporada = require('../models/pilotoEquipeTemporadaModel');

class PilotoEquipeTemporadaController {
    static async GetPilotosEquipesTemporadas(req, res) {
        try {
            const pilotosEquipesTemporadas = await PilotoEquipeTemporada.Get();
            return res.status(200).json(pilotosEquipesTemporadas);
        } catch (error) {
            console.error('Erro no controller (GetPilotosEquipesTemporadas):', error);
            return res.status(500).json({ erro: 'Erro ao buscar pilotos por equipe/temporada' });
        }
    }

    static async GetPilotoEquipeTemporadaById(req, res) {
        try {
            const { id_piloto_equipe_temporada } = req.params;
            if (isNaN(id_piloto_equipe_temporada)) {
                return res.status(400).json({ erro: 'ID da relação piloto/equipe/temporada deve ser um número' });
            }
            
            const pilotoEquipeTemporada = await PilotoEquipeTemporada.GetById(parseInt(id_piloto_equipe_temporada));
            if (!pilotoEquipeTemporada) {
                return res.status(404).json({ erro: 'Relação piloto/equipe/temporada não encontrada' });
            }
            
            return res.status(200).json(pilotoEquipeTemporada);
        } catch (error) {
            console.error('Erro no controller (GetPilotoEquipeTemporadaById):', error);
            return res.status(500).json({ erro: 'Erro ao buscar relação piloto/equipe/temporada' });
        }
    }

    static async GetPilotosPorEquipeTemporada(req, res) {
        try {
            const { id_equipe_temporada } = req.params;
            
            if (isNaN(id_equipe_temporada)) {
                return res.status(400).json({ erro: 'ID da equipe/temporada deve ser um número' });
            }
            
            const pilotosEquipeTemporada = await PilotoEquipeTemporada.GetByEquipeTemporada(parseInt(id_equipe_temporada));
            
            if (pilotosEquipeTemporada.length === 0) {
                return res.status(404).json({ 
                    mensagem: 'Nenhum piloto encontrado para esta equipe/temporada',
                    id_equipe_temporada
                });
            }
            
            return res.status(200).json(pilotosEquipeTemporada);
        } catch (error) {
            console.error('Erro no controller (GetPilotosPorEquipeTemporada):', error);
            return res.status(500).json({ erro: 'Erro ao buscar pilotos da equipe/temporada' });
        }
    }

    static async InsertPilotoEquipeTemporada(req, res) {
        try {
            const { id_piloto, id_equipe_temporada, numero_carro } = req.body;
            
            if (!id_piloto || !id_equipe_temporada || numero_carro === undefined) {
                return res.status(400).json({ erro: 'ID do piloto, ID da equipe/temporada e número do carro são obrigatórios' });
            }
            
            const rowsAffected = await PilotoEquipeTemporada.Insert(
                id_piloto, 
                id_equipe_temporada, 
                numero_carro
            );
            
            return res.status(201).json({ 
                mensagem: 'Piloto vinculado à equipe/temporada com sucesso',
                rowsAffected: rowsAffected
            });
        } catch (error) {
            console.error('Erro no controller (InsertPilotoEquipeTemporada):', error);
            return res.status(500).json({ erro: 'Erro ao vincular piloto à equipe/temporada' });
        }
    }

    static async UpdatePilotoEquipeTemporada(req, res) {
        try {
            const { id_piloto_equipe_temporada } = req.params;
            const { numero_carro } = req.body;
            
            if (isNaN(id_piloto_equipe_temporada)) {
                return res.status(400).json({ erro: 'ID da relação piloto/equipe/temporada deve ser um número' });
            }
            
            if (numero_carro === undefined) {
                return res.status(400).json({ erro: 'O campo número do carro deve ser fornecido para atualização' });
            }
            
            const rowsAffected = await PilotoEquipeTemporada.Update(
                parseInt(id_piloto_equipe_temporada), 
                numero_carro
            );
            
            if (rowsAffected > 0) {
                return res.status(200).json({ mensagem: 'Relação piloto/equipe/temporada atualizada com sucesso' });
            } else {
                return res.status(404).json({ erro: 'Relação piloto/equipe/temporada não encontrada' });
            }
        } catch (error) {
            console.error('Erro no controller (UpdatePilotoEquipeTemporada):', error);
            return res.status(500).json({ erro: 'Erro ao atualizar relação piloto/equipe/temporada' });
        }
    }

    static async DeletePilotoEquipeTemporada(req, res) {
        try {
            const { id_piloto_equipe_temporada } = req.params;
            
            if (isNaN(id_piloto_equipe_temporada)) {
                return res.status(400).json({ erro: 'ID da relação piloto/equipe/temporada deve ser um número' });
            }
            
            const rowsAffected = await PilotoEquipeTemporada.Delete(parseInt(id_piloto_equipe_temporada));
            
            if (rowsAffected > 0) {
                return res.status(200).json({ mensagem: 'Relação piloto/equipe/temporada removida com sucesso' });
            } else {
                return res.status(404).json({ erro: 'Relação piloto/equipe/temporada não encontrada' });
            }
        } catch (error) {
            console.error('Erro no controller (DeletePilotoEquipeTemporada):', error);
            return res.status(500).json({ erro: 'Erro ao remover piloto da equipe/temporada' });
        }
    }
}

module.exports = PilotoEquipeTemporadaController;