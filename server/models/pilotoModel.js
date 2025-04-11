const { sql, poolPromise } = require('../utils/db');

class Piloto {
    constructor(id_piloto, nome_piloto, nacionalidade_piloto, data_nascimento_piloto, foto_piloto_url, descricao_piloto) {
        this.id_piloto = id_piloto || null;
        this.nome_piloto = nome_piloto || '';
        this.nacionalidade_piloto = nacionalidade_piloto || '';
        this.data_nascimento_piloto = data_nascimento_piloto || null;
        this.foto_piloto_url = foto_piloto_url || '';
        this.descricao_piloto = descricao_piloto || '';
    }

    static async Get() {
        try {
            const pool = await poolPromise;
            const result = await pool.request().query('SELECT * FROM pilotos ORDER BY nome_piloto');
            return result.recordset;
        } catch (error) {
            console.error('Erro ao buscar pilotos:', error);
            throw error;
        }
    }

    static async GetById(id_piloto) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_piloto', sql.Int, id_piloto)
                .query('SELECT * FROM pilotos WHERE id_piloto = @id_piloto');
            return result.recordset[0] || null;
        } catch (error) {
            console.error('Erro ao buscar piloto:', error);
            throw error;
        }
    }

    static async GetByTemporada(id_temporada) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_temporada', sql.Int, id_temporada)
                .query(`
                    SELECT p.* 
                    FROM pilotos p
                    JOIN pilotos_equipes_temporadas pet ON p.id_piloto = pet.id_piloto
                    JOIN equipes_temporadas et ON pet.id_equipe_temporada = et.id_equipe_temporada
                    WHERE et.id_temporada = @id_temporada
                    ORDER BY p.nome_piloto
                `);
            return result.recordset;
        } catch (error) {
            console.error('Erro ao buscar pilotos por temporada:', error);
            throw error;
        }
    }

    static async Insert(nome_piloto, nacionalidade_piloto, data_nascimento_piloto, foto_piloto_url, descricao_piloto) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('nome_piloto', sql.VarChar(100), nome_piloto)
                .input('nacionalidade_piloto', sql.VarChar(50), nacionalidade_piloto)
                .input('data_nascimento_piloto', sql.Date, data_nascimento_piloto)
                .input('foto_piloto_url', sql.VarChar(255), foto_piloto_url)
                .input('descricao_piloto', sql.Text, descricao_piloto)
                .query('INSERT INTO pilotos (nome_piloto, nacionalidade_piloto, data_nascimento_piloto, foto_piloto_url, descricao_piloto) VALUES (@nome_piloto, @nacionalidade_piloto, @data_nascimento_piloto, @foto_piloto_url, @descricao_piloto)');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao inserir piloto:', error);
            throw error;
        }
    }

    static async Update(id_piloto, nome_piloto, nacionalidade_piloto, data_nascimento_piloto, foto_piloto_url, descricao_piloto) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_piloto', sql.Int, id_piloto)
                .input('nome_piloto', sql.VarChar(100), nome_piloto)
                .input('nacionalidade_piloto', sql.VarChar(50), nacionalidade_piloto)
                .input('data_nascimento_piloto', sql.Date, data_nascimento_piloto)
                .input('foto_piloto_url', sql.VarChar(255), foto_piloto_url)
                .input('descricao_piloto', sql.Text, descricao_piloto)
                .query('UPDATE pilotos SET nome_piloto = @nome_piloto, nacionalidade_piloto = @nacionalidade_piloto, data_nascimento_piloto = @data_nascimento_piloto, foto_piloto_url = @foto_piloto_url, descricao_piloto = @descricao_piloto WHERE id_piloto = @id_piloto');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao atualizar piloto:', error);
            throw error;
        }
    }

    static async Delete(id_piloto) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_piloto', sql.Int, id_piloto)
                .query('DELETE FROM pilotos WHERE id_piloto = @id_piloto');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao deletar piloto:', error);
            throw error;
        }
    }
}

module.exports = Piloto;