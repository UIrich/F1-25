const Piloto = require('../models/pilotoModel');

class PilotoController {
    static async GetPilotos(req, res) {
        try {
            const pilotos = await Piloto.Get();
            return res.status(200).json(pilotos);
        } catch (error) {
            console.error('Erro no controller (GetPilotos):', error);
            return res.status(500).json({ erro: 'Erro ao buscar pilotos' });
        }
    }

    static async GetPilotoById(req, res) {
        try {
            const { id_piloto } = req.params;
            if (isNaN(id_piloto)) {
                return res.status(400).json({ erro: 'ID do piloto deve ser um número' });
            }
            
            const piloto = await Piloto.GetById(parseInt(id_piloto));
            if (!piloto) {
                return res.status(404).json({ erro: 'Piloto não encontrado' });
            }
            
            return res.status(200).json(piloto);
        } catch (error) {
            console.error('Erro no controller (GetPilotoById):', error);
            return res.status(500).json({ erro: 'Erro ao buscar piloto' });
        }
    }

    static async GetPilotosPorTemporada(req, res) {
        try {
            const { id_temporada } = req.params;
            
            if (isNaN(id_temporada)) {
                return res.status(400).json({ erro: 'ID da temporada deve ser um número' });
            }
            
            const pilotos = await Piloto.GetByTemporada(parseInt(id_temporada));
            
            if (pilotos.length === 0) {
                return res.status(404).json({ 
                    mensagem: 'Nenhum piloto encontrado para esta temporada',
                    id_temporada
                });
            }
            
            return res.status(200).json(pilotos);
        } catch (error) {
            console.error('Erro no controller (GetPilotosPorTemporada):', error);
            return res.status(500).json({ erro: 'Erro ao buscar pilotos da temporada' });
        }
    }

    static async InsertPiloto(req, res) {
        try {
            const { nome_piloto, nacionalidade_piloto, data_nascimento_piloto, foto_piloto_url, descricao_piloto } = req.body;
            
            if (!nome_piloto) {
                return res.status(400).json({ erro: 'Nome do piloto é obrigatório' });
            }
            
            const rowsAffected = await Piloto.Insert(
                nome_piloto, 
                nacionalidade_piloto, 
                data_nascimento_piloto, 
                foto_piloto_url, 
                descricao_piloto
            );
            
            return res.status(201).json({ 
                mensagem: 'Piloto inserido com sucesso',
                rowsAffected
            });
        } catch (error) {
            console.error('Erro no controller (InsertPiloto):', error);
            return res.status(500).json({ erro: 'Erro ao inserir piloto' });
        }
    }

    static async UpdatePiloto(req, res) {
        try {
            const { id_piloto } = req.params;
            const { nome_piloto, nacionalidade_piloto, data_nascimento_piloto, foto_piloto_url, descricao_piloto } = req.body;
            
            if (isNaN(id_piloto)) {
                return res.status(400).json({ erro: 'ID do piloto deve ser um número' });
            }
            
            if (!nome_piloto) {
                return res.status(400).json({ erro: 'Nome do piloto é obrigatório' });
            }
            
            const rowsAffected = await Piloto.Update(
                parseInt(id_piloto), 
                nome_piloto, 
                nacionalidade_piloto, 
                data_nascimento_piloto, 
                foto_piloto_url, 
                descricao_piloto
            );
            
            if (rowsAffected > 0) {
                return res.status(200).json({ mensagem: 'Piloto atualizado com sucesso' });
            } else {
                return res.status(404).json({ erro: 'Piloto não encontrado' });
            }
        } catch (error) {
            console.error('Erro no controller (UpdatePiloto):', error);
            return res.status(500).json({ erro: 'Erro ao atualizar piloto' });
        }
    }

    static async DeletePiloto(req, res) {
        try {
            const { id_piloto } = req.params;
            
            if (isNaN(id_piloto)) {
                return res.status(400).json({ erro: 'ID do piloto deve ser um número' });
            }
            
            const rowsAffected = await Piloto.Delete(parseInt(id_piloto));
            
            if (rowsAffected > 0) {
                return res.status(200).json({ mensagem: 'Piloto excluído com sucesso' });
            } else {
                return res.status(404).json({ erro: 'Piloto não encontrado' });
            }
        } catch (error) {
            console.error('Erro no controller (DeletePiloto):', error);
            return res.status(500).json({ erro: 'Erro ao excluir piloto' });
        }
    }
}

module.exports = PilotoController;