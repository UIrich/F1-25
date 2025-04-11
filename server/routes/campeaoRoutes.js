const express = require('express');
const router = express.Router();
const CampeaoController = require('../controllers/campeaoController');

// Rotas para campeões
router.get('/', CampeaoController.GetCampeoes);
router.get('/:id_campeao', CampeaoController.GetCampeaoById);
router.get('/temporada/:id_temporada', CampeaoController.GetCampeoesPorTemporada);
router.post('/', CampeaoController.InsertCampeao);
router.put('/:id_campeao', CampeaoController.UpdateCampeao);
router.delete('/:id_campeao', CampeaoController.DeleteCampeao);

module.exports = router;