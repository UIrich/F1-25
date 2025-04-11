const express = require('express');
const router = express.Router();
const CorridaController = require('../controllers/corridaController');

// Rotas para corridas
router.get('/', CorridaController.GetCorridas);
router.get('/:id_corrida', CorridaController.GetCorridaById);
router.get('/temporada/:id_temporada', CorridaController.GetCorridasPorTemporada);
router.get('/:id_corrida/resultados', CorridaController.GetResultadosPorCorrida);
router.post('/', CorridaController.InsertCorrida);
router.put('/:id_corrida', CorridaController.UpdateCorrida);
router.delete('/:id_corrida', CorridaController.DeleteCorrida);

module.exports = router;