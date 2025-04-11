const { sql, poolPromise } = require('../utils/db');

class PilotoEquipeTemporada {
    constructor(id_piloto_equipe_temporada, id_piloto, id_equipe_temporada, numero_carro) {
        this.id_piloto_equipe_temporada = id_piloto_equipe_temporada || null;
        this.id_piloto = id_piloto || null;
        this.id_equipe_temporada = id_equipe_temporada || null;
        this.numero_carro = numero_carro || null;
    }

    static async Get() {
        try {
            const pool = await poolPromise;
            const result = await pool.request().query(`
                SELECT pet.*, 
                       p.nome_piloto, 
                       e.nome_equipe, 
                       t.ano_temporada
                FROM pilotos_equipes_temporadas pet
                JOIN pilotos p ON pet.id_piloto = p.id_piloto
                JOIN equipes_temporadas et ON pet.id_equipe_temporada = et.id_equipe_temporada
                JOIN equipes e ON et.id_equipe = e.id_equipe
                JOIN temporadas t ON et.id_temporada = t.id_temporada
                ORDER BY t.ano_temporada DESC, e.nome_equipe, p.nome_piloto
            `);
            return result.recordset;
        } catch (error) {
            console.error('Erro ao buscar pilotos por equipe/temporada:', error);
            throw error;
        }
    }

    static async GetById(id_piloto_equipe_temporada) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_piloto_equipe_temporada', sql.Int, id_piloto_equipe_temporada)
                .query(`
                    SELECT pet.*, 
                           p.nome_piloto, 
                           e.nome_equipe, 
                           t.ano_temporada
                    FROM pilotos_equipes_temporadas pet
                    JOIN pilotos p ON pet.id_piloto = p.id_piloto
                    JOIN equipes_temporadas et ON pet.id_equipe_temporada = et.id_equipe_temporada
                    JOIN equipes e ON et.id_equipe = e.id_equipe
                    JOIN temporadas t ON et.id_temporada = t.id_temporada
                    WHERE pet.id_piloto_equipe_temporada = @id_piloto_equipe_temporada
                `);
            return result.recordset[0] || null;
        } catch (error) {
            console.error('Erro ao buscar piloto por equipe/temporada:', error);
            throw error;
        }
    }

    static async GetByEquipeTemporada(id_equipe_temporada) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_equipe_temporada', sql.Int, id_equipe_temporada)
                .query(`
                    SELECT pet.*, p.nome_piloto
                    FROM pilotos_equipes_temporadas pet
                    JOIN pilotos p ON pet.id_piloto = p.id_piloto
                    WHERE pet.id_equipe_temporada = @id_equipe_temporada
                    ORDER BY p.nome_piloto
                `);
            return result.recordset;
        } catch (error) {
            console.error('Erro ao buscar pilotos por equipe/temporada:', error);
            throw error;
        }
    }

    static async Insert(id_piloto, id_equipe_temporada, numero_carro) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_piloto', sql.Int, id_piloto)
                .input('id_equipe_temporada', sql.Int, id_equipe_temporada)
                .input('numero_carro', sql.Int, numero_carro)
                .query('INSERT INTO pilotos_equipes_temporadas (id_piloto, id_equipe_temporada, numero_carro) VALUES (@id_piloto, @id_equipe_temporada, @numero_carro)');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao vincular piloto à equipe/temporada:', error);
            throw error;
        }
    }

    static async Update(id_piloto_equipe_temporada, numero_carro) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_piloto_equipe_temporada', sql.Int, id_piloto_equipe_temporada)
                .input('numero_carro', sql.Int, numero_carro)
                .query('UPDATE pilotos_equipes_temporadas SET numero_carro = @numero_carro WHERE id_piloto_equipe_temporada = @id_piloto_equipe_temporada');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao atualizar piloto na equipe/temporada:', error);
            throw error;
        }
    }

    static async Delete(id_piloto_equipe_temporada) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_piloto_equipe_temporada', sql.Int, id_piloto_equipe_temporada)
                .query('DELETE FROM pilotos_equipes_temporadas WHERE id_piloto_equipe_temporada = @id_piloto_equipe_temporada');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao remover piloto da equipe/temporada:', error);
            throw error;
        }
    }
}

module.exports = PilotoEquipeTemporada;