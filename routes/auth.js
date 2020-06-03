const express = require('express');
const {check} = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const router = express.Router();

// autenticacion del usuario para el login
router.post('/', 

    authController.autenticarUsuario
)
router.get('/', 

      auth,  
    authController.userauth
)
module.exports = router;