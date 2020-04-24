const { Router } = require('express');
const router = Router();
//? modulo para ver su esta auntenticado
const auth = require('../middlewares/auth')
//? librearia para poder validar 
const { check } = require('express-validator');
//? importando el controlador
const tareaController = require('../controllers/tareaController');

//? crear una tarea 
//? api/tareas

router.post('/', auth,
    [
        check('nombre', 'EL nombre es obligatorio').not().isEmpty(),
        check('proyecto', 'EL proyecto es obligatorio').not().isEmpty(),

    ], tareaController.crearTarea
);

router.get('/', auth,
    tareaController.obtenerTareas
)

router.put('/:id',
    auth,
    tareaController.actualizarTarea
)

//?Eliminar tarea
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
)
module.exports = router;