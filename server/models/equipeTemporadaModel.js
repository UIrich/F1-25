const { sql, poolPromise } = require('../utils/db');

class EquipeTemporada {
    constructor(id_equipe_temporada, id_equipe, id_temporada) {
        this.id_equipe_temporada = id_equipe_temporada || null;
        this.id_equipe = id_equipe || null;
        this.id_temporada = id_temporada || null;
    }

    static async Get() {
        try {
            const pool = await poolPromise;
            const result = await pool.request().query(`
                SELECT et.*, e.nome_equipe, t.ano_temporada 
                FROM equipes_temporadas et
                JOIN equipes e ON et.id_equipe = e.id_equipe
                JOIN temporadas t ON et.id_temporada = t.id_temporada
                ORDER BY t.ano_temporada DESC, e.nome_equipe
            `);
            return result.recordset;
        } catch (error) {
            console.error('Erro ao buscar equipes por temporada:', error);
            throw error;
        }
    }

    static async GetById(id_equipe_temporada) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_equipe_temporada', sql.Int, id_equipe_temporada)
                .query(`
                    SELECT et.*, e.nome_equipe, t.ano_temporada 
                    FROM equipes_temporadas et
                    JOIN equipes e ON et.id_equipe = e.id_equipe
                    JOIN temporadas t ON et.id_temporada = t.id_temporada
                    WHERE et.id_equipe_temporada = @id_equipe_temporada
                `);
            return result.recordset[0] || null;
        } catch (error) {
            console.error('Erro ao buscar equipe por temporada:', error);
            throw error;
        }
    }

    static async GetByTemporada(id_temporada) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_temporada', sql.Int, id_temporada)
                .query(`
                    SELECT et.*, e.nome_equipe, t.ano_temporada 
                    FROM equipes_temporadas et
                    JOIN equipes e ON et.id_equipe = e.id_equipe
                    JOIN temporadas t ON et.id_temporada = t.id_temporada
                    WHERE et.id_temporada = @id_temporada
                    ORDER BY e.nome_equipe
                `);
            return result.recordset;
        } catch (error) {
            console.error('Erro ao buscar equipes por temporada:', error);
            throw error;
        }
    }

    static async Insert(id_equipe, id_temporada) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_equipe', sql.Int, id_equipe)
                .input('id_temporada', sql.Int, id_temporada)
                .query('INSERT INTO equipes_temporadas (id_equipe, id_temporada) VALUES (@id_equipe, @id_temporada)');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao vincular equipe à temporada:', error);
            throw error;
        }
    }

    static async Delete(id_equipe_temporada) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_equipe_temporada', sql.Int, id_equipe_temporada)
                .query('DELETE FROM equipes_temporadas WHERE id_equipe_temporada = @id_equipe_temporada');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao remover equipe da temporada:', error);
            throw error;
        }
    }
}

module.exports = EquipeTemporada;