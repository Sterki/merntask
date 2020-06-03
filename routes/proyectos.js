const express = require('express');
const {check} = require('express-validator');
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');

const router = express.Router();

// crea proyectos
// api/proyectos
router.post('/',
    

    auth,
    [ 
       check('nombre', 'Debe ingresar un nombre para el proyecto').not().isEmpty()
    ],
   
    proyectoController.crearProyecto
  
)
// onbtiene todos los proyectos
router.get('/',

    auth,
    proyectoController.obtenerProyectos

)
// actualiza un proyecto
router.put('/:id',

    auth,
    [ 
        check('nombre', 'Debe ingresar un nombre para el proyecto').not().isEmpty()
     ],
    proyectoController.actualizaProyectos

)
// eliminar un proyecto 
router.delete('/:id',

    auth,
    proyectoController.eliminaProyecto

)
module.exports = router;



