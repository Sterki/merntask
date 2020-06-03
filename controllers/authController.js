const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) =>{


    // validar los campso del usuario que viene del request

    const errores = validationResult(req);
    if(!errores.isEmpty()){

        return res.status(400).json({errores: errores.array()});
    }

    // extraemos valores desde nuestro request

    const {email, password} = req.body;

    try{

        // authenticamos que exista un usuario en nuestra base de datos por medio del email

        let usuario = await Usuario.findOne({email});
        if(!usuario){ // verificamos que existe

            return res.status(400).json({msg:'El usuario no existe'}); // si no existe devolvemos un status de error
        }
        // si el usuario existe entonces comparamos las password hasheadas
        let passcompare = await bcryptjs.compare(password, usuario.password);
        if(!passcompare){ // si las password no coindicen entonces

            return res.status(400).json({msg:'Las passwords no coinciden'}); // devolvemos un status de error como json
        }
        // si todas las condiciones se cumplen y el usuario existe entonces le asignamos un token

        // aqui creamos nuestro payload para firmar el token
        const payload = {

            usuario: {

                id: usuario.id

            }
        }
        // aqui firmamos nuestro token 
        jwt.sign(payload, process.env.SECRETA, {

            expiresIn: 3600
        }, (error, token)=>{

            if(error) throw error;
            res.json({token: token});
        })
    }catch(error){

        console.log(error);
    }
}
exports.userauth = async(req, res) =>{

    try {

            const usuario = await Usuario.findById(req.usuario.id).select('-password');             
            res.json(usuario);

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Hubo un error'});
    }

}