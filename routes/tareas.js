const express = require('express');
const {check} = require('express-validator');
const tareasController = require('../controllers/tareasController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/',

    auth,
    [
        check('nombre', 'Debe ingresar un nombre para la tarea').not().isEmpty()


    ],
    tareasController.crearTarea


)

router.get('/',

    auth,
    tareasController.obtenerTareas


)
router.put('/:id',

    auth,
    tareasController.actualizaTareas


)
router.delete('/:id',

    auth,
    tareasController.eliminaTarea


)

module.exports = router;