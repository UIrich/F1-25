const express = require('express');
const router = express.Router();
const EquipeTemporadaController = require('../controllers/equipeTemporadaController');

// Rotas para equipes por temporada
router.get('/', EquipeTemporadaController.GetEquipesTemporadas);
router.get('/:id_equipe_temporada', EquipeTemporadaController.GetEquipeTemporadaById);
router.get('/temporada/:id_temporada', EquipeTemporadaController.GetEquipesPorTemporada);
router.post('/', EquipeTemporadaController.InsertEquipeTemporada);
router.delete('/:id_equipe_temporada', EquipeTemporadaController.DeleteEquipeTemporada);

module.exports = router;