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
    //? revisar si hay errores
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }


    //? extraer el emaily password
    const { email, password } = req.body;
    try {
        //? revisar que sea un usuario registrado
        let usuario = await UserModel.findOne({ email });
        if (!usuario) {
            res.status(400).json({ mgs: 'El usuario no existe' })
        }
        //?Revisar su password
        const passCorrect = await bcryptjs.compare(password, usuario.password);
        if (!passCorrect) {
            return res.status(400).json({ msg: 'Password Incorrecto' })
        }
        //? si todo es correcto, creramos el jwt

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
            //mensje de confirmacion
            res.json({ token })
        });



    } catch (error) {
        console.log('hubo un error');
        res.json({ mesage: error })
    }
}