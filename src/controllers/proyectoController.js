// modulo para validaciones
const { validationResult } = require('express-validator');


const ProyectoModel = require('../models/proyectoModel');

exports.crearProyecto = async (req, res) => {

    //?revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    try {
        //? Crear un nuevo proyecto
        const proyecto = new ProyectoModel(req.body);
        //? guardar el creador via jwt
        proyecto.creador = req.usuario.id;

        //? guardamos el proyecto
        await proyecto.save();
        res.json(proyecto);

    } catch (error) {
        console.log(error);
        return res.status(500).send('Hubo un error')
    }
}

exports.verProyectos = async (req, res) => {
    try {
        //? obteniendo los proyectos del usuari actual
        const proyectos = await ProyectoModel.find({ creador: req.usuario.id });
        res.json({ proyectos })
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.actualizarProyectos = async (req, res) => {
    //?revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }
    //? extraer la informacion del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {
    }
    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }
    try {
        //? revisar el ID
        let proyecto = await ProyectoModel.findById(req.params.id);
        console.log(proyecto)
        // ?si el proyecto existe o no
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyectos no encontrado ' })
        }
        // ?verificar el creador
        if (proyecto.creador.toString() !== req.usuario.id) {
            res.status(401).send('No autorizado');
        }
        //? actualizar
        proyecto = await ProyectoModel.findByIdAndUpdate({ _id: req.params.id }, {
            $set:
                nuevoProyecto
        }, { new: true });
        res.json({ proyecto });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor')
    }

}

exports.eliminarProyecto = async (req, res) => {

    try {
        let proyecto = await ProyectoModel.findById(req.params.id);
        // ?si el proyecto existe o no
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado ' })
        }
        // ?verificar el creador
        if (proyecto.creador.toString() !== req.usuario.id) {
            res.status(401).send('No autorizado');
        }
        //? eliminar
        await ProyectoModel.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Proyecto eliminado' })

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor')
    }

}