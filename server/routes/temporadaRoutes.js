const express = require('express');
const router = express.Router();
const TemporadaController = require('../controllers/temporadaController');

// Rotas para temporadas
router.get('/', TemporadaController.GetTemporadas);
router.get('/:id_temporada', TemporadaController.GetTemporadaById);
router.get('/ano/:ano_temporada', TemporadaController.GetTemporadaByYear);
router.get('/:id_temporada/corridas', TemporadaController.GetCorridasPorTemporada);
router.post('/', TemporadaController.InsertTemporada);
router.put('/:id_temporada', TemporadaController.UpdateTemporada);
router.delete('/:id_temporada', TemporadaController.DeleteTemporada);

module.exports = router;