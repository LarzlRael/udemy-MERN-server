
//? librerias
//*para encriptar
const bcryptjs = require('bcryptjs');
//*para validar
const { validationResult } = require('express-validator');
//*JSONWEBTOKEN
const jwt = require('jsonwebtoken');
//?
const UserModel = require('../models/UsuarioModel')

exports.crearUsuario = async (req, res) => {

    //? revisar si hay erroers 
    const errors = validationResult(req);
    //? revisar si hay errores
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }


    // *extraer email y password
    const { email, password } = req.body;


    try {
        //? verificar si el usuario es unico
        let usuario = await UserModel.findOne({ email });

        if (usuario) {
            return res.status(400).json({ msg: 'El email ya fue registro ' })
        }

        usuario = new UserModel(req.body);
        //? hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        await usuario.save();

        //? crear y firmar con jwt
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
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

exports.crear = async (req, res) => {
    res.json('hola desde controlador')
}