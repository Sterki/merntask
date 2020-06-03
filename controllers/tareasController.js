const Tareas = require('../models/Tareas');
const {validationResult} = require('express-validator');
const Proyectos = require('../models/Proyectos');

exports.crearTarea = async(req, res) =>{

    let errores = validationResult(req);
    if(!errores.isEmpty()){

        return res.status(400).json({errores: errores.array()});
    }
    try {
        
        // primero debemso corroborar el id del proyecto que viene como valor

        const {proyecto} = req.body;
        
        // una vez validado el id del proyecto que queremos asignar tareas
        // debemos validar que el proyecto exista
        let existeProyecto = await Proyectos.findById(proyecto);
        if(!existeProyecto){

            return res.status(404).json({msg:'No se pudo encontrar el proyecto asociado'});
        }

        // una vez que el proyecto existe debemos corroborar que el usuario que queire agregar tareas se encuentre autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){

            return res.status(400).json({msg: 'El usuario no esta autorizado para editar este proyecto'});
        }
       // creamos la tarea 

       let tarea = new Tareas(req.body);
       // guardamos la tarea
       await tarea.save();
       res.json({msg:'Tarea guardada exitosamente'});

    } catch (error) {
            console.log(error);
            res.status(500).json({msg: 'Hubo un problema en el servidor'});
    }

}

exports.obtenerTareas = async(req, res) =>{

    try {

         // primero verificamos que el proyecto exista nuevamente
         
        const {proyecto} = req.query;

        let existeProyecto = await Proyectos.findById(proyecto);
        if(!existeProyecto){

            return res.status(404).json({msg:'Proyecto no encotrado'});
        }
        // si el proyecto existe validamos que el usuario sea igual al del req
        if(existeProyecto.creador.toString() !== req.usuario.id){

            return res.status(400).json({msg:'No tiene permisos para continuar'});
        }

        let tareas = await Tareas.find({proyecto: proyecto});
        res.json({tareas});


    } catch (error) {
            console.log(error);
            res.status(500).json({msg:'Hubo un error en el servidor'});

    }

}
exports.actualizaTareas = async(req, res)=>{

    try {

        const {proyecto, nombre, estado} = req.body;
        // validamos que una tarea exista

        let tarea = await Tareas.findById(req.params.id);
        if(!tarea){

            return res.status(400).json({msg:'La tarea no existe'});
        }
        // si la tarea existe verificamso que el usuario sea el autenticado
            let existeProyecto = await Proyectos.findById(proyecto);
        if(existeProyecto.creador.toString() !== req.usuario.id){

            return res.status(400).json({msg:'No tiene permisos para continuar'});
        }

        //si pasa las validaciones creamos el nuevo objeto 

        const nuevaTarea = {};
       
            nuevaTarea.nombre = nombre;
            nuevaTarea.estado = estado;
      


        // una vez creado el objeto procedemos a actualizar nuestra tarea

          tarea = await Tareas.findOneAndUpdate({_id: req.params.id}, nuevaTarea, {new: true});
            res.json({tarea});

    } catch (error) {
        console.log(error);
    }


}
exports.eliminaTarea = async (req, res) =>{

    const {proyecto} = req.query;
    

    try {
        
        // primero extraemos el proyecto que queremos eliminar

        let tarea = await Tareas.findById(req.params.id);
        
        if(!tarea){

            return res.status(400).json({msg:'La tarea no existe'});
        }
        
        // eliminamos la tarea

        await Tareas.findOneAndRemove({_id: req.params.id});
        res.json({msg:'Tarea Eliminada con exito'});

    } catch (error) {
            console.log(error);
            res.status(500).json({msg:'Hubo un error en el servidor'});
    }

}