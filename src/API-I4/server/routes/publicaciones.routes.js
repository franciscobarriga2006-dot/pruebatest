const express = require('express');
const { patchPublicacion, deletePublicacion, getPublicacionById,   getPublicaciones,createPublicacion } = require('../controllers/publicaciones.controller.js');

const router = express.Router();

router.patch('/publicaciones/:id', patchPublicacion);
router.delete('/publicaciones/:id', deletePublicacion);
router.get('/publicaciones/:id', getPublicacionById); 
router.get('/publicaciones', getPublicaciones);
router.post('/publicaciones', createPublicacion);

module.exports = router;
