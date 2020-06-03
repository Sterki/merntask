const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');


exports.crearUsuario = async (req, res) =>{

    // validar si hay errores

    const errores = validationResult(req);

    if(!errores.isEmpty()){

        return res.status(400).json({errores: errores.array()});
    }

    // necesitamos validar que no ingresen el mismo correo mas de una vez

    const {email, password} = req.body;
    try {

        // en esta linea de codigo nos busca un usuario que tenga el mismo email
        let usuario = await Usuario.findOne({email});

       if(usuario){ // si hay un usuario en nuestra base de datos con el mismo email

            return res.status(400).json({msg: 'El usuario ya existe'}); // entonces retornamos un status de error y lo mandamos como mensaje json

       }
       // si no hay un usuario con el mismo email entonces lo creamos
        usuario = new Usuario(req.body);

        // hashear el password es buena idea hashear el password cuando creamos el nuevo usuario

        let salt = await bcryptjs.genSalt(10);

        usuario.password = await bcryptjs.hash(password, salt);

        await usuario.save();

        // aqui una vez creado el usuario debemos crear nuestro JWT y firmarlo
        // primero creamos el payload de informacion
       // creamos el payload del token
        const payload = {

            usuario: {

                id: usuario.id
            }
        };
        // aqui firmamos nuestro token
        jwt.sign(payload, process.env.SECRETA, {

            expiresIn: 3600

        }, (error, token)=>{

            if(error) throw error;

            res.json({token: token});
        })

    } catch (error) {

        console.log(error);
        res.status(400).send('Hubo problemas creando el usuario');
    }
}
