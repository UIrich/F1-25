const express = require('express');
const router = express.Router();
const ResultadoController = require('../controllers/resultadoController');

// Rotas para resultados
router.get('/', ResultadoController.GetResultados);
router.get('/:id_resultado', ResultadoController.GetResultadoById);
router.get('/corrida/:id_corrida', ResultadoController.GetResultadosPorCorrida);
router.post('/', ResultadoController.InsertResultado);
router.put('/:id_resultado', ResultadoController.UpdateResultado);
router.delete('/:id_resultado', ResultadoController.DeleteResultado);

module.exports = router;