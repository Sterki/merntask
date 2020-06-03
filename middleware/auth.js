const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){

    // leer el token cuando el usuario ingrese(es decir el token del usuario desde el header)

    let token = req.header('x-auth-token'); // con esta linea obtenemos el token que nos envia desde el header

    if(!token){

        return res.status(401).json({msg:'No hay token permiso no valido'});
    }


    // va a validar que el token sea valido
    try {

        let tokencifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = tokencifrado.usuario;
        next();

    } catch (error) {
            res.status(401).json({msg:'Token no valido'});
    }
}