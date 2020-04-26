const { Router } = require('express');
const router = Router();
//? modulo para ver su esta auntenticado
const auth = require('../middlewares/auth');
//? librearia para poder validar 
const { check } = require('express-validator');
const proyectoAuth = require('../controllers/proyectoController');
//? crea proyecto
//? api/proyectos


router.post('/', auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ], proyectoAuth.crearProyecto);

router.get('/',
    auth,
    proyectoAuth.verProyectos
)
router.put('/:id',
    [check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()],
    auth,
    proyectoAuth.actualizarProyectos
)
router.delete('/:id',
    auth,
    proyectoAuth.eliminarProyecto
)
module.exports = router;