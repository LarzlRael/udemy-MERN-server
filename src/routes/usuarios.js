const { Router } = require('express');
const router = Router();
// * usando express validators
const { check } = require('express-validator');

//?controladores
const usuarioController = require('../controllers/userController');

router.post('/', [
    check('nombre', 'El nombre es obligatrio').not().isEmpty(),
    check('email', 'Agrega un email valido').isEmail(),
    check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 })
], usuarioController.crearUsuario);

router.post('/', usuarioController.crear)
module.exports = router;