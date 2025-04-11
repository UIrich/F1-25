const Usuario = require('../models/usuarioModel');
const { sql } = require('../utils/db');

class UsuarioController {
    static async GetUsuarios(req, res) {
        try {
            const usuarios = await Usuario.Get();
            return res.status(200).json(usuarios);
        } catch (error) {
            console.error('Erro no controller (GetUsuarios):', error);
            return res.status(500).json({ erro: 'Erro ao buscar usuários' });
        }
    }

    static async GetUsuarioById(req, res) {
        try {
            const { id_usuario } = req.params;
            if (isNaN(id_usuario)) {
                return res.status(400).json({ erro: 'ID do usuário deve ser um número' });
            }
            
            const usuario = await Usuario.GetById(parseInt(id_usuario));
            if (!usuario) {
                return res.status(404).json({ erro: 'Usuário não encontrado' });
            }
            
            return res.status(200).json(usuario);
        } catch (error) {
            console.error('Erro no controller (GetUsuarioById):', error);
            return res.status(500).json({ erro: 'Erro ao buscar usuário' });
        }
    }

    static async GetUsuarioByEmail(req, res) {
        try {
            const { email_usuario } = req.params;
            
            const usuario = await Usuario.GetByEmail(email_usuario);
            if (!usuario) {
                return res.status(404).json({ erro: 'Usuário não encontrado' });
            }
            
            return res.status(200).json(usuario);
        } catch (error) {
            console.error('Erro no controller (GetUsuarioByEmail):', error);
            return res.status(500).json({ erro: 'Erro ao buscar usuário por email' });
        }
    }

    static async InsertUsuario(req, res) {
        try {
            const { nome_usuario, email_usuario, senha_usuario } = req.body;
            
            if (!nome_usuario || !email_usuario || !senha_usuario) {
                return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
            }
            
            const rowsAffected = await Usuario.Insert(nome_usuario, email_usuario, senha_usuario);
            
            return res.status(201).json({ 
                mensagem: 'Usuário inserido com sucesso',
                rowsAffected
            });
        } catch (error) {
            console.error('Erro no controller (InsertUsuario):', error);
            
            if (error instanceof sql.RequestError && error.number === 2627) {
                return res.status(400).json({ erro: 'Email já cadastrado' });
            }
            
            return res.status(500).json({ erro: 'Erro ao inserir usuário' });
        }
    }

    static async UpdateUsuario(req, res) {
        try {
            const { id_usuario } = req.params;
            const { nome_usuario, email_usuario } = req.body;
            
            if (isNaN(id_usuario)) {
                return res.status(400).json({ erro: 'ID do usuário deve ser um número' });
            }
            
            if (!nome_usuario || !email_usuario) {
                return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
            }
            
            const rowsAffected = await Usuario.Update(parseInt(id_usuario), nome_usuario, email_usuario);
            
            if (rowsAffected > 0) {
                return res.status(200).json({ mensagem: 'Usuário atualizado com sucesso' });
            } else {
                return res.status(404).json({ erro: 'Usuário não encontrado' });
            }
        } catch (error) {
            console.error('Erro no controller (UpdateUsuario):', error);
            
            if (error instanceof sql.RequestError && error.number === 2627) {
                return res.status(400).json({ erro: 'Email já cadastrado' });
            }
            
            return res.status(500).json({ erro: 'Erro ao atualizar usuário' });
        }
    }

    static async DeleteUsuario(req, res) {
        try {
            const { id_usuario } = req.params;
            
            if (isNaN(id_usuario)) {
                return res.status(400).json({ erro: 'ID do usuário deve ser um número' });
            }
            
            const rowsAffected = await Usuario.Delete(parseInt(id_usuario));
            
            if (rowsAffected > 0) {
                return res.status(200).json({ mensagem: 'Usuário excluído com sucesso' });
            } else {
                return res.status(404).json({ erro: 'Usuário não encontrado' });
            }
        } catch (error) {
            console.error('Erro no controller (DeleteUsuario):', error);
            return res.status(500).json({ erro: 'Erro ao excluir usuário' });
        }
    }
}

module.exports = UsuarioController;