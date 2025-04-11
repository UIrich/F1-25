const Resultado = require('../models/resultadoModel');

class ResultadoController {
    static async GetResultados(req, res) {
        try {
            const resultados = await Resultado.Get();
            return res.status(200).json(resultados);
        } catch (error) {
            console.error('Erro no controller (GetResultados):', error);
            return res.status(500).json({ erro: 'Erro ao buscar resultados' });
        }
    }

    static async GetResultadoById(req, res) {
        try {
            const { id_resultado } = req.params;
            if (isNaN(id_resultado)) {
                return res.status(400).json({ erro: 'ID do resultado deve ser um número' });
            }
            
            const resultado = await Resultado.GetById(parseInt(id_resultado));
            if (!resultado) {
                return res.status(404).json({ erro: 'Resultado não encontrado' });
            }
            
            return res.status(200).json(resultado);
        } catch (error) {
            console.error('Erro no controller (GetResultadoById):', error);
            return res.status(500).json({ erro: 'Erro ao buscar resultado' });
        }
    }

    static async GetResultadosPorCorrida(req, res) {
        try {
            const { id_corrida } = req.params;
            
            if (isNaN(id_corrida)) {
                return res.status(400).json({ erro: 'ID da corrida deve ser um número' });
            }
            
            const resultados = await Resultado.GetByCorrida(parseInt(id_corrida));
            
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

    static async InsertResultado(req, res) {
        try {
            const { id_corrida, id_piloto_equipe_temporada, posicao_inicial, posicao_final, pontuacao, status_corrida } = req.body;
            
            if (!id_corrida || !id_piloto_equipe_temporada || posicao_inicial === undefined || posicao_final === undefined || !status_corrida) {
                return res.status(400).json({ erro: 'ID da corrida, ID do piloto/equipe/temporada, posições e status são obrigatórios' });
            }
            
            const rowsAffected = await Resultado.Insert(
                id_corrida, 
                id_piloto_equipe_temporada, 
                posicao_inicial, 
                posicao_final, 
                pontuacao || 0, 
                status_corrida
            );
            
            return res.status(201).json({ 
                mensagem: 'Resultado inserido com sucesso',
                rowsAffected
            });
        } catch (error) {
            console.error('Erro no controller (InsertResultado):', error);
            return res.status(500).json({ erro: 'Erro ao inserir resultado' });
        }
    }

    static async UpdateResultado(req, res) {
        try {
            const { id_resultado } = req.params;
            const { posicao_inicial, posicao_final, pontuacao, status_corrida } = req.body;
            
            if (isNaN(id_resultado)) {
                return res.status(400).json({ erro: 'ID do resultado deve ser um número' });
            }
            
            if (posicao_inicial === undefined && posicao_final === undefined && pontuacao === undefined && !status_corrida) {
                return res.status(400).json({ erro: 'Pelo menos um campo deve ser fornecido para atualização' });
            }
            
            const rowsAffected = await Resultado.Update(
                parseInt(id_resultado), 
                posicao_inicial, 
                posicao_final, 
                pontuacao, 
                status_corrida
            );
            
            if (rowsAffected > 0) {
                return res.status(200).json({ mensagem: 'Resultado atualizado com sucesso' });
            } else {
                return res.status(404).json({ erro: 'Resultado não encontrado' });
            }
        } catch (error) {
            console.error('Erro no controller (UpdateResultado):', error);
            return res.status(500).json({ erro: 'Erro ao atualizar resultado' });
        }
    }

    static async DeleteResultado(req, res) {
        try {
            const { id_resultado } = req.params;
            
            if (isNaN(id_resultado)) {
                return res.status(400).json({ erro: 'ID do resultado deve ser um número' });
            }
            
            const rowsAffected = await Resultado.Delete(parseInt(id_resultado));
            
            if (rowsAffected > 0) {
                return res.status(200).json({ mensagem: 'Resultado excluído com sucesso' });
            } else {
                return res.status(404).json({ erro: 'Resultado não encontrado' });
            }
        } catch (error) {
            console.error('Erro no controller (DeleteResultado):', error);
            return res.status(500).json({ erro: 'Erro ao excluir resultado' });
        }
    }
}

module.exports = ResultadoController;