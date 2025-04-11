const { sql, poolPromise } = require('../utils/db');

class Campeao {
    constructor(id_campeao, id_temporada, id_piloto, id_equipe, ano_campeao) {
        this.id_campeao = id_campeao || null;
        this.id_temporada = id_temporada || null;
        this.id_piloto = id_piloto || null;
        this.id_equipe = id_equipe || null;
        this.ano_campeao = ano_campeao || null;
    }

    static async Get() {
        try {
            const pool = await poolPromise;
            const result = await pool.request().query(`
                SELECT c.*, 
                       t.ano_temporada,
                       p.nome_piloto,
                       e.nome_equipe
                FROM campeoes c
                LEFT JOIN temporadas t ON c.id_temporada = t.id_temporada
                LEFT JOIN pilotos p ON c.id_piloto = p.id_piloto
                LEFT JOIN equipes e ON c.id_equipe = e.id_equipe
                ORDER BY t.ano_temporada DESC
            `);
            return result.recordset;
        } catch (error) {
            console.error('Erro ao buscar campeões:', error);
            throw error;
        }
    }

    static async GetById(id_campeao) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_campeao', sql.Int, id_campeao)
                .query(`
                    SELECT c.*, 
                           t.ano_temporada,
                           p.nome_piloto,
                           e.nome_equipe
                    FROM campeoes c
                    LEFT JOIN temporadas t ON c.id_temporada = t.id_temporada
                    LEFT JOIN pilotos p ON c.id_piloto = p.id_piloto
                    LEFT JOIN equipes e ON c.id_equipe = e.id_equipe
                    WHERE c.id_campeao = @id_campeao
                `);
            return result.recordset[0] || null;
        } catch (error) {
            console.error('Erro ao buscar campeão:', error);
            throw error;
        }
    }

    static async GetByTemporada(id_temporada) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_temporada', sql.Int, id_temporada)
                .query(`
                    SELECT c.*, 
                           p.nome_piloto,
                           e.nome_equipe
                    FROM campeoes c
                    LEFT JOIN pilotos p ON c.id_piloto = p.id_piloto
                    LEFT JOIN equipes e ON c.id_equipe = e.id_equipe
                    WHERE c.id_temporada = @id_temporada
                `);
            return result.recordset;
        } catch (error) {
            console.error('Erro ao buscar campeões por temporada:', error);
            throw error;
        }
    }

    static async Insert(id_temporada, id_piloto, id_equipe) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_temporada', sql.Int, id_temporada)
                .input('id_piloto', sql.Int, id_piloto)
                .input('id_equipe', sql.Int, id_equipe)
                .query('INSERT INTO campeoes (id_temporada, id_piloto, id_equipe) VALUES (@id_temporada, @id_piloto, @id_equipe)');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao inserir campeão:', error);
            throw error;
        }
    }

    static async Update(id_campeao, id_piloto, id_equipe) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_campeao', sql.Int, id_campeao)
                .input('id_piloto', sql.Int, id_piloto)
                .input('id_equipe', sql.Int, id_equipe)
                .query('UPDATE campeoes SET id_piloto = @id_piloto, id_equipe = @id_equipe WHERE id_campeao = @id_campeao');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao atualizar campeão:', error);
            throw error;
        }
    }

    static async Delete(id_campeao) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_campeao', sql.Int, id_campeao)
                .query('DELETE FROM campeoes WHERE id_campeao = @id_campeao');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao deletar campeão:', error);
            throw error;
        }
    }
}

module.exports = Campeao;