// rutas para usuarios utilizamos express como servidor encargado de enviar las peticiones
const express = require('express');
const {check} = require('express-validator');

// importamos nuestro controller para ejecutar las funciones y sus request
const usuarioControllers = require('../controllers/usuarioControler');

// y luego como express tiene un metodo o funcion que ejecuta rutas o request lo mandamos llamar de la siguiente forma
const router = express.Router(); // se lo asignamos a una variable


// crea usuarios
// api/usuarios
// crea un usuario 
// y el endpoint sera api/usuarios
// y luego a router le asignamos un metodo de request que sera de tipo post y la ruta especificada es la ruta de usuarios en /api/usuarios
router.post('/',

  [

    check('nombre', 'Debe ingresar el nombre').not().isEmpty(),
    check('email', 'Debe ingresar un email valido').isEmail(),
    check('password', 'debe ingresar un password minimo 6 caracteres').isLength({min: 6})

  ],
    usuarioControllers.crearUsuario



);

//usuarioControllers.crearUsuario


// espoeramos router
module.exports = router;
