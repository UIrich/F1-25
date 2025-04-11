const { sql, poolPromise } = require('../utils/db');

class Temporada {
    constructor(id_temporada, ano_temporada, status_temporada, data_inicio_temporada, data_fim_temporada, foto_temporada_url) {
        this.id_temporada = id_temporada || null;
        this.ano_temporada = ano_temporada || null;
        this.status_temporada = status_temporada || 'Ativa';
        this.data_inicio_temporada = data_inicio_temporada || null;
        this.data_fim_temporada = data_fim_temporada || null;
        this.foto_temporada_url = foto_temporada_url || '';
    }

    static async Get() {
        try {
            const pool = await poolPromise;
            const result = await pool.request().query('SELECT * FROM temporadas ORDER BY ano_temporada DESC');
            return result.recordset;
        } catch (error) {
            console.error('Erro ao buscar temporadas:', error);
            throw error;
        }
    }

    static async GetById(id_temporada) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_temporada', sql.Int, id_temporada)
                .query('SELECT * FROM temporadas WHERE id_temporada = @id_temporada');
            return result.recordset[0] || null;
        } catch (error) {
            console.error('Erro ao buscar temporada:', error);
            throw error;
        }
    }

    static async GetByYear(ano_temporada) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('ano_temporada', sql.Int, ano_temporada)
                .query('SELECT * FROM temporadas WHERE ano_temporada = @ano_temporada');
            return result.recordset[0] || null;
        } catch (error) {
            console.error('Erro ao buscar temporada por ano:', error);
            throw error;
        }
    }

    static async Insert(ano_temporada, status_temporada, data_inicio_temporada, data_fim_temporada, foto_temporada_url) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('ano_temporada', sql.Int, ano_temporada)
                .input('status_temporada', sql.VarChar(20), status_temporada)
                .input('data_inicio_temporada', sql.Date, data_inicio_temporada)
                .input('data_fim_temporada', sql.Date, data_fim_temporada)
                .input('foto_temporada_url', sql.VarChar(255), foto_temporada_url)
                .query('INSERT INTO temporadas (ano_temporada, status_temporada, data_inicio_temporada, data_fim_temporada, foto_temporada_url) VALUES (@ano_temporada, @status_temporada, @data_inicio_temporada, @data_fim_temporada, @foto_temporada_url)');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao inserir temporada:', error);
            throw error;
        }
    }

    static async Update(id_temporada, ano_temporada, status_temporada, data_inicio_temporada, data_fim_temporada, foto_temporada_url) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_temporada', sql.Int, id_temporada)
                .input('ano_temporada', sql.Int, ano_temporada)
                .input('status_temporada', sql.VarChar(20), status_temporada)
                .input('data_inicio_temporada', sql.Date, data_inicio_temporada)
                .input('data_fim_temporada', sql.Date, data_fim_temporada)
                .input('foto_temporada_url', sql.VarChar(255), foto_temporada_url)
                .query('UPDATE temporadas SET ano_temporada = @ano_temporada, status_temporada = @status_temporada, data_inicio_temporada = @data_inicio_temporada, data_fim_temporada = @data_fim_temporada, foto_temporada_url = @foto_temporada_url WHERE id_temporada = @id_temporada');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao atualizar temporada:', error);
            throw error;
        }
    }

    static async Delete(id_temporada) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_temporada', sql.Int, id_temporada)
                .query('DELETE FROM temporadas WHERE id_temporada = @id_temporada');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao deletar temporada:', error);
            throw error;
        }
    }

    static async GetCorridasPorTemporada(id_temporada) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_temporada', sql.Int, id_temporada)
                .query('SELECT * FROM corridas WHERE id_temporada = @id_temporada ORDER BY data_corrida');
            return result.recordset;
        } catch (error) {
            console.error('Erro ao buscar corridas da temporada:', error);
            throw error;
        }
    }
}

module.exports = Temporada;