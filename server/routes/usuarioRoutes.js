const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');

// Rotas para usuários
router.get('/', UsuarioController.GetUsuarios);
router.get('/:id_usuario', UsuarioController.GetUsuarioById);
router.get('/email/:email_usuario', UsuarioController.GetUsuarioByEmail);
router.post('/', UsuarioController.InsertUsuario);
router.put('/:id_usuario', UsuarioController.UpdateUsuario);
router.delete('/:id_usuario', UsuarioController.DeleteUsuario);

module.exports = router;