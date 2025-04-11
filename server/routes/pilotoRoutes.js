const express = require('express');
const router = express.Router();
const PilotoController = require('../controllers/pilotoController');

// Rotas para pilotos
router.get('/', PilotoController.GetPilotos);
router.get('/:id_piloto', PilotoController.GetPilotoById);
router.get('/temporada/:id_temporada', PilotoController.GetPilotosPorTemporada);
router.post('/', PilotoController.InsertPiloto);
router.put('/:id_piloto', PilotoController.UpdatePiloto);
router.delete('/:id_piloto', PilotoController.DeletePiloto);

module.exports = router;