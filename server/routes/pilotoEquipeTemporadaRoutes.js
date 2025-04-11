const express = require('express');
const router = express.Router();
const PilotoEquipeTemporadaController = require('../controllers/pilotoEquipeTemporadaController');

// Rotas para pilotos por equipe/temporada
router.get('/', PilotoEquipeTemporadaController.GetPilotosEquipesTemporadas);
router.get('/:id_piloto_equipe_temporada', PilotoEquipeTemporadaController.GetPilotoEquipeTemporadaById);
router.get('/equipe-temporada/:id_equipe_temporada', PilotoEquipeTemporadaController.GetPilotosPorEquipeTemporada);
router.post('/', PilotoEquipeTemporadaController.InsertPilotoEquipeTemporada);
router.put('/:id_piloto_equipe_temporada', PilotoEquipeTemporadaController.UpdatePilotoEquipeTemporada);
router.delete('/:id_piloto_equipe_temporada', PilotoEquipeTemporadaController.DeletePilotoEquipeTemporada);

module.exports = router;