const express = require('express');
const {
  createPostulacion,
  getMisPostulaciones,
  patchPostulacion,
  deletePostulacion, // <-- agregado
} = require('../controllers/postulaciones.controller.js');

const router = express.Router();

router.patch('/postulaciones/:id', patchPostulacion);
router.post('/postulaciones', createPostulacion);
router.get('/mis_postulaciones', getMisPostulaciones);
router.delete('/postulaciones/:id', deletePostulacion); // <-- agregado

module.exports = router;
