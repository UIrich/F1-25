const { sql, poolPromise } = require('../utils/db');

class Resultado {
    constructor(id_resultado, id_corrida, id_piloto_equipe_temporada, posicao_inicial, posicao_final, pontuacao, status_corrida) {
        this.id_resultado = id_resultado || null;
        this.id_corrida = id_corrida || null;
        this.id_piloto_equipe_temporada = id_piloto_equipe_temporada || null;
        this.posicao_inicial = posicao_inicial || null;
        this.posicao_final = posicao_final || null;
        this.pontuacao = pontuacao || 0;
        this.status_corrida = status_corrida || 'Completou';
    }

    static async Get() {
        try {
            const pool = await poolPromise;
            const result = await pool.request().query(`
                SELECT r.*, 
                       c.nome_corrida,
                       p.nome_piloto,
                       e.nome_equipe,
                       t.ano_temporada
                FROM resultados r
                JOIN corridas c ON r.id_corrida = c.id_corrida
                JOIN pilotos_equipes_temporadas pet ON r.id_piloto_equipe_temporada = pet.id_piloto_equipe_temporada
                JOIN pilotos p ON pet.id_piloto = p.id_piloto
                JOIN equipes_temporadas et ON pet.id_equipe_temporada = et.id_equipe_temporada
                JOIN equipes e ON et.id_equipe = e.id_equipe
                JOIN temporadas t ON et.id_temporada = t.id_temporada
                ORDER BY t.ano_temporada DESC, c.data_corrida, r.posicao_final
            `);
            return result.recordset;
        } catch (error) {
            console.error('Erro ao buscar resultados:', error);
            throw error;
        }
    }

    static async GetById(id_resultado) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_resultado', sql.Int, id_resultado)
                .query(`
                    SELECT r.*, 
                           c.nome_corrida,
                           p.nome_piloto,
                           e.nome_equipe,
                           t.ano_temporada
                    FROM resultados r
                    JOIN corridas c ON r.id_corrida = c.id_corrida
                    JOIN pilotos_equipes_temporadas pet ON r.id_piloto_equipe_temporada = pet.id_piloto_equipe_temporada
                    JOIN pilotos p ON pet.id_piloto = p.id_piloto
                    JOIN equipes_temporadas et ON pet.id_equipe_temporada = et.id_equipe_temporada
                    JOIN equipes e ON et.id_equipe = e.id_equipe
                    JOIN temporadas t ON et.id_temporada = t.id_temporada
                    WHERE r.id_resultado = @id_resultado
                `);
            return result.recordset[0] || null;
        } catch (error) {
            console.error('Erro ao buscar resultado:', error);
            throw error;
        }
    }

    static async GetByCorrida(id_corrida) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_corrida', sql.Int, id_corrida)
                .query(`
                    SELECT r.*, 
                           p.nome_piloto,
                           e.nome_equipe
                    FROM resultados r
                    JOIN pilotos_equipes_temporadas pet ON r.id_piloto_equipe_temporada = pet.id_piloto_equipe_temporada
                    JOIN pilotos p ON pet.id_piloto = p.id_piloto
                    JOIN equipes_temporadas et ON pet.id_equipe_temporada = et.id_equipe_temporada
                    JOIN equipes e ON et.id_equipe = e.id_equipe
                    WHERE r.id_corrida = @id_corrida
                    ORDER BY r.posicao_final
                `);
            return result.recordset;
        } catch (error) {
            console.error('Erro ao buscar resultados por corrida:', error);
            throw error;
        }
    }

    static async Insert(id_corrida, id_piloto_equipe_temporada, posicao_inicial, posicao_final, pontuacao, status_corrida) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_corrida', sql.Int, id_corrida)
                .input('id_piloto_equipe_temporada', sql.Int, id_piloto_equipe_temporada)
                .input('posicao_inicial', sql.Int, posicao_inicial)
                .input('posicao_final', sql.Int, posicao_final)
                .input('pontuacao', sql.Decimal(10,1), pontuacao)
                .input('status_corrida', sql.VarChar(10), status_corrida)
                .query('INSERT INTO resultados (id_corrida, id_piloto_equipe_temporada, posicao_inicial, posicao_final, pontuacao, status_corrida) VALUES (@id_corrida, @id_piloto_equipe_temporada, @posicao_inicial, @posicao_final, @pontuacao, @status_corrida)');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao inserir resultado:', error);
            throw error;
        }
    }

    static async Update(id_resultado, posicao_inicial, posicao_final, pontuacao, status_corrida) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_resultado', sql.Int, id_resultado)
                .input('posicao_inicial', sql.Int, posicao_inicial)
                .input('posicao_final', sql.Int, posicao_final)
                .input('pontuacao', sql.Decimal(10,1), pontuacao)
                .input('status_corrida', sql.VarChar(10), status_corrida)
                .query('UPDATE resultados SET posicao_inicial = @posicao_inicial, posicao_final = @posicao_final, pontuacao = @pontuacao, status_corrida = @status_corrida WHERE id_resultado = @id_resultado');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao atualizar resultado:', error);
            throw error;
        }
    }

    static async Delete(id_resultado) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_resultado', sql.Int, id_resultado)
                .query('DELETE FROM resultados WHERE id_resultado = @id_resultado');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao deletar resultado:', error);
            throw error;
        }
    }
}

module.exports = Resultado;