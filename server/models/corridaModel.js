const { sql, poolPromise } = require('../utils/db');

class Corrida {
    constructor(id_corrida, id_temporada, nome_corrida, local_corrida, data_corrida) {
        this.id_corrida = id_corrida || null;
        this.id_temporada = id_temporada || null;
        this.nome_corrida = nome_corrida || '';
        this.local_corrida = local_corrida || '';
        this.data_corrida = data_corrida || null;
    }

    static async Get() {
        try {
            const pool = await poolPromise;
            const result = await pool.request().query(`
                SELECT c.*, t.ano_temporada 
                FROM corridas c
                JOIN temporadas t ON c.id_temporada = t.id_temporada
                ORDER BY t.ano_temporada DESC, c.data_corrida
            `);
            return result.recordset;
        } catch (error) {
            console.error('Erro ao buscar corridas:', error);
            throw error;
        }
    }

    static async GetById(id_corrida) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_corrida', sql.Int, id_corrida)
                .query(`
                    SELECT c.*, t.ano_temporada 
                    FROM corridas c
                    JOIN temporadas t ON c.id_temporada = t.id_temporada
                    WHERE c.id_corrida = @id_corrida
                `);
            return result.recordset[0] || null;
        } catch (error) {
            console.error('Erro ao buscar corrida:', error);
            throw error;
        }
    }

    static async GetByTemporada(id_temporada) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_temporada', sql.Int, id_temporada)
                .query('SELECT * FROM corridas WHERE id_temporada = @id_temporada ORDER BY data_corrida');
            return result.recordset;
        } catch (error) {
            console.error('Erro ao buscar corridas por temporada:', error);
            throw error;
        }
    }

    static async Insert(id_temporada, nome_corrida, local_corrida, data_corrida) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_temporada', sql.Int, id_temporada)
                .input('nome_corrida', sql.VarChar(100), nome_corrida)
                .input('local_corrida', sql.VarChar(100), local_corrida)
                .input('data_corrida', sql.Date, data_corrida)
                .query('INSERT INTO corridas (id_temporada, nome_corrida, local_corrida, data_corrida) VALUES (@id_temporada, @nome_corrida, @local_corrida, @data_corrida)');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao inserir corrida:', error);
            throw error;
        }
    }

    static async Update(id_corrida, nome_corrida, local_corrida, data_corrida) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_corrida', sql.Int, id_corrida)
                .input('nome_corrida', sql.VarChar(100), nome_corrida)
                .input('local_corrida', sql.VarChar(100), local_corrida)
                .input('data_corrida', sql.Date, data_corrida)
                .query('UPDATE corridas SET nome_corrida = @nome_corrida, local_corrida = @local_corrida, data_corrida = @data_corrida WHERE id_corrida = @id_corrida');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao atualizar corrida:', error);
            throw error;
        }
    }

    static async Delete(id_corrida) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_corrida', sql.Int, id_corrida)
                .query('DELETE FROM corridas WHERE id_corrida = @id_corrida');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao deletar corrida:', error);
            throw error;
        }
    }

    static async GetResultados(id_corrida) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_corrida', sql.Int, id_corrida)
                .query(`
                    SELECT r.*, 
                           p.nome_piloto,
                           e.nome_equipe,
                           t.ano_temporada
                    FROM resultados r
                    JOIN pilotos_equipes_temporadas pet ON r.id_piloto_equipe_temporada = pet.id_piloto_equipe_temporada
                    JOIN pilotos p ON pet.id_piloto = p.id_piloto
                    JOIN equipes_temporadas et ON pet.id_equipe_temporada = et.id_equipe_temporada
                    JOIN equipes e ON et.id_equipe = e.id_equipe
                    JOIN temporadas t ON et.id_temporada = t.id_temporada
                    WHERE r.id_corrida = @id_corrida
                    ORDER BY r.posicao_final
                `);
            return result.recordset;
        } catch (error) {
            console.error('Erro ao buscar resultados da corrida:', error);
            throw error;
        }
    }
}

module.exports = Corrida;