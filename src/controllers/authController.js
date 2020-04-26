//? librerias
//*para encriptar
const bcryptjs = require('bcryptjs');
//*para validar
const { validationResult } = require('express-validator');
//*JSONWEBTOKEN
const jwt = require('jsonwebtoken');
//? 
const UserModel = require('../models/UsuarioModel')

exports.autenticarUsuario = async (req, res) => {
    //? revisar si hay errores 
    const errors = validationResult(req);
    // //? revisar si hay errores
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    //? extraer el emaily password
    let { email, password } = req.body;
    email = email.toLowerCase();
    try {
        //? revisar que sea un usuario registrado
        let usuario = await UserModel.findOne({ email });
        if (!usuario) {
            console.log('no se encontro usuario ');
            return res.status(400).json({ msg: 'El usuario no existe' })
        }
        //?Revisar su password
        const passCorrect = await bcryptjs.compare(password, usuario.password);
        if (!passCorrect) {
            console.log('contraseña incorrecta')
            return res.status(400).json({ msg: 'Password Incorrecto' })
        }
        //? si todo es correcto, creamos el jwt

        const payload = {
            usuario: {
                id: usuario.id
            }
        }
        //? firmar el jwt
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error;
            //mensaje de confirmacion
            res.json({ token })
        });

    } catch (error) {
        console.log('hubo un error');
        return res.status(500).json({ msg: error });
    }
}

//? OBtiene que usuario esta autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await UserModel.findById(req.usuario.id).select('-password');
        res.json({ usuario });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}