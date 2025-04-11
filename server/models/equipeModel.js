const { sql, poolPromise } = require('../utils/db');

class Equipe {
    constructor(id_equipe, nome_equipe, fundacao_equipe, logo_equipe_url, descricao_equipe) {
        this.id_equipe = id_equipe || null;
        this.nome_equipe = nome_equipe || '';
        this.fundacao_equipe = fundacao_equipe || null;
        this.logo_equipe_url = logo_equipe_url || '';
        this.descricao_equipe = descricao_equipe || '';
    }

    static async Get() {
        try {
            const pool = await poolPromise;
            const result = await pool.request().query('SELECT * FROM equipes ORDER BY nome_equipe');
            return result.recordset;
        } catch (error) {
            console.error('Erro ao buscar equipes:', error);
            throw error;
        }
    }

    static async GetById(id_equipe) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_equipe', sql.Int, id_equipe)
                .query('SELECT * FROM equipes WHERE id_equipe = @id_equipe');
            return result.recordset[0] || null;
        } catch (error) {
            console.error('Erro ao buscar equipe:', error);
            throw error;
        }
    }

    static async GetByTemporada(id_temporada) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_temporada', sql.Int, id_temporada)
                .query(`
                    SELECT e.* 
                    FROM equipes e
                    JOIN equipes_temporadas et ON e.id_equipe = et.id_equipe
                    WHERE et.id_temporada = @id_temporada
                    ORDER BY e.nome_equipe
                `);
            return result.recordset;
        } catch (error) {
            console.error('Erro ao buscar equipes por temporada:', error);
            throw error;
        }
    }

    static async Insert(nome_equipe, fundacao_equipe, logo_equipe_url, descricao_equipe) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('nome_equipe', sql.VarChar(100), nome_equipe)
                .input('fundacao_equipe', sql.Date, fundacao_equipe)
                .input('logo_equipe_url', sql.VarChar(255), logo_equipe_url)
                .input('descricao_equipe', sql.Text, descricao_equipe)
                .query('INSERT INTO equipes (nome_equipe, fundacao_equipe, logo_equipe_url, descricao_equipe) VALUES (@nome_equipe, @fundacao_equipe, @logo_equipe_url, @descricao_equipe)');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao inserir equipe:', error);
            throw error;
        }
    }

    static async Update(id_equipe, nome_equipe, fundacao_equipe, logo_equipe_url, descricao_equipe) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_equipe', sql.Int, id_equipe)
                .input('nome_equipe', sql.VarChar(100), nome_equipe)
                .input('fundacao_equipe', sql.Date, fundacao_equipe)
                .input('logo_equipe_url', sql.VarChar(255), logo_equipe_url)
                .input('descricao_equipe', sql.Text, descricao_equipe)
                .query('UPDATE equipes SET nome_equipe = @nome_equipe, fundacao_equipe = @fundacao_equipe, logo_equipe_url = @logo_equipe_url, descricao_equipe = @descricao_equipe WHERE id_equipe = @id_equipe');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao atualizar equipe:', error);
            throw error;
        }
    }

    static async Delete(id_equipe) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_equipe', sql.Int, id_equipe)
                .query('DELETE FROM equipes WHERE id_equipe = @id_equipe');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao deletar equipe:', error);
            throw error;
        }
    }
}

module.exports = Equipe;