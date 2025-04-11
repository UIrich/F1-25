const express = require('express');
const router = express.Router();
const EquipeController = require('../controllers/equipeController');

// Rotas para equipes
router.get('/', EquipeController.GetEquipes);
router.get('/:id_equipe', EquipeController.GetEquipeById);
router.get('/temporada/:id_temporada', EquipeController.GetEquipesPorTemporada);
router.post('/', EquipeController.InsertEquipe);
router.put('/:id_equipe', EquipeController.UpdateEquipe);
router.delete('/:id_equipe', EquipeController.DeleteEquipe);

module.exports = router;