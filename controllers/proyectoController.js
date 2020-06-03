const Proyectos = require('../models/Proyectos');
const {validationResult} = require('express-validator');

exports.crearProyecto = async(req, res)=>{

    const errores = validationResult(req);
    if(!errores.isEmpty()){

       return res.status(400).json({errores: errores.array()});
    }
    try{        
        let proyecto = new Proyectos(req.body);

        // obtener el usuario que crea el proyecto por medio de jwt

        proyecto.creador = req.usuario.id;
        // guardamos el proyecto
        await proyecto.save();
        res.json(proyecto);

    }catch(error){
        console.error();
        
    }
}
// otiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) =>{
    
    const errores = validationResult(req);
    if(!errores.isEmpty()){

       return res.status(400).json({errores: errores.array()});
    }

    try {

        let proyectos = await Proyectos.find({ creador:  req.usuario.id}).sort({creado: -1});
        res.json({proyectos});

    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error obteniendo proyectos'});
    }


}
// actualiza proyecto
exports.actualizaProyectos = async (req, res) =>{

    const errores = validationResult(req);
    if(!errores.isEmpty()){

       return res.status(400).json({errores: errores.array()});
    }
        const {nombre} = req.body;
        const nuevoProyecto = {};

        if(nombre){

            nuevoProyecto.nombre = nombre;
        }

    try {
        // buscamos el proyecto por medio de su id unico
        let proyectos = await Proyectos.findById(req.params.id);
        // luego vemos si el proyecto existe

        if(!proyectos){

         return res.status(400).json({msg:'El Proyecto no existe'});
        
        }
        // verificamos el creador del proyecto
        if(proyectos.creador.toString() !== req.usuario.id){

            return res.status(400).json({msg: 'El usuario no esta autorizado para editar este proyecto'});
        }


        // por ultimo actualizamos
           proyectos = await Proyectos.findByIdAndUpdate({_id: req.params.id}, {$set : nuevoProyecto}, {new: true});
            res.json({proyectos});

    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Hubo un problema al Actualizar el proyecto'});
    }


}

// elimina un proyecto por su id

exports.eliminaProyecto = async(req, res) =>{

    try {

        // validamos que el id de proyecto que se queira eliminar exista

        let proyecto = await Proyectos.findById(req.params.id);
        
        if(!proyecto){

            return res.status(404).json({msg: 'El proyecto no existe'});
            
        }
        //verficamos que el usuario que queire eliminar sea el usuario autenticado

        if(proyecto.creador.toString() !== req.usuario.id){

            return res.status(400).json({msg: 'no tiene permisos'});
        }
        // ahora si una vez validados todos los campos, eliminamos el proyecto

        await Proyectos.findOneAndRemove({_id: req.params.id});

        res.json({msg:'Proyecto eliminado con exito'});


    } catch (error) {

        console.log(error);
        res.status(500).json({msg:'Hubo un error en el servidor'})
    }

}