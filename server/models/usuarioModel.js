const { sql, poolPromise } = require('../utils/db');

class Usuario {
    constructor(id_usuario, nome_usuario, email_usuario, senha_usuario, cadastro_usuario) {
        this.id_usuario = id_usuario || null;
        this.nome_usuario = nome_usuario || '';
        this.email_usuario = email_usuario || '';
        this.senha_usuario = senha_usuario || '';
        this.cadastro_usuario = cadastro_usuario || null;
    }

    static async Get() {
        try {
            const pool = await poolPromise;
            const result = await pool.request().query('SELECT * FROM usuarios');
            return result.recordset;
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            throw error;
        }
    }

    static async GetById(id_usuario) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_usuario', sql.Int, id_usuario)
                .query('SELECT * FROM usuarios WHERE id_usuario = @id_usuario');
            return result.recordset[0] || null;
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            throw error;
        }
    }

    static async GetByEmail(email_usuario) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('email_usuario', sql.VarChar(100), email_usuario)
                .query('SELECT * FROM usuarios WHERE email_usuario = @email_usuario');
            return result.recordset[0] || null;
        } catch (error) {
            console.error('Erro ao buscar usuário por email:', error);
            throw error;
        }
    }

    static async Insert(nome_usuario, email_usuario, senha_usuario) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('nome_usuario', sql.VarChar(100), nome_usuario)
                .input('email_usuario', sql.VarChar(100), email_usuario)
                .input('senha_usuario', sql.VarChar(255), senha_usuario)
                .query('INSERT INTO usuarios (nome_usuario, email_usuario, senha_usuario) VALUES (@nome_usuario, @email_usuario, @senha_usuario)');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao inserir usuário:', error);
            throw error;
        }
    }

    static async Update(id_usuario, nome_usuario, email_usuario) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_usuario', sql.Int, id_usuario)
                .input('nome_usuario', sql.VarChar(100), nome_usuario)
                .input('email_usuario', sql.VarChar(100), email_usuario)
                .query('UPDATE usuarios SET nome_usuario = @nome_usuario, email_usuario = @email_usuario WHERE id_usuario = @id_usuario');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw error;
        }
    }

    static async Delete(id_usuario) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id_usuario', sql.Int, id_usuario)
                .query('DELETE FROM usuarios WHERE id_usuario = @id_usuario');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            throw error;
        }
    }
}

module.exports = Usuario;