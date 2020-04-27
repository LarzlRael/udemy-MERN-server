const TareaModel = require('../models/tareaModel');
const ProyectoModel = require('../models/proyectoModel');
const { validationResult } = require('express-validator');
exports.crearTarea = async (req, res) => {

    //? Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        //? Extraer el proyecto y comprobar si existe
        const { proyecto } = req.body;
        const existeProyecto = await ProyectoModel.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        //? Revisar si el proyecto actual pertenece al usuario antenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        //? cramos la tarea
        const tarea = new TareaModel(req.body);
        await tarea.save();
        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.obtenerTareas = async (req, res) => {
    try {
        const { proyecto } = req.query;
        const existeProyecto = await ProyectoModel.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        //? Revisar si el proyecto actual pertenece al usuario antenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }
        //? Obtener las tareas por proyecto
        const tareas = await TareaModel.find({ proyecto }).sort({ creado: -1 })
        res.json({ tareas });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.actualizarTarea = async (req, res) => {
    try {
        //? extraer el proyeco y comprobar su existe
        const { proyecto, nombre, estado } = req.body;

        //= si la tarea exisite o no
        const tareaExiste = await TareaModel.findById(req.params.id);
        if (!tareaExiste) {
            return res.status(404).json({ msg: 'No existe esa tarea' })
        }
        //? extraer proyecto
        const existeProyecto = await ProyectoModel.findById(proyecto);

        //? Revisar si el proyecto actual pertenece al usuario antenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // ?Crear un objeto con la nueva informacion
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //?Guardar Tarea
        tarea = await TareaModel.findByIdAndUpdate({ _id: req.params.id }, nuevaTarea, {
            new: true
        });

        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.eliminarTarea = async (req, res) => {
    try {
        //? extraer el proyeco y comprobar su existe
        const { proyecto } = req.query;
        console.log(proyecto)
        //= si la tarea exisite o no
        const tareaExiste = await TareaModel.findById(req.params.id);
        if (!tareaExiste) {
            return res.status(404).json({ msg: 'No existe esa tarea' })
        }
        //? extraer proyecto
        const existeProyecto = await ProyectoModel.findById(proyecto);

        //? Revisar si el proyecto actual pertenece al usuario antenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }
        //?Eliminar
        await TareaModel.findOneAndRemove({ _id: req.params.id });

        res.json({ mg: 'Tarea Eliminada' });


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}