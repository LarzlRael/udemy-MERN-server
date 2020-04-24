const express = require('express');
const conectarDB = require('./config/db');
// crear el servidor
const app = express();

// conectar a la base de datos
conectarDB();

// puerto de la app
const PORT = process.env.PORT || 4000;

//Definir las rutas

app.get('/', (req, res) => {
    res.send('hola mudno xd')
})


app.listen(PORT, () => {
    console.log(`El Servidor esta en http://localhost:${PORT}`)
})