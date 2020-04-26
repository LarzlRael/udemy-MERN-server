const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
//? conexion a la base de datos mongodb
const conectarDB = require('./config/db');

const userRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');
const proyectosRoutes = require('./routes/proyecto');
const tareasRoutes = require('./routes/tareas');

//? crear el servidor
const app = express();

// ?conectar a la base de datos
conectarDB();
//? habilitar cors
app.use(cors());
// ?puerto de la app

const PORT = process.env.PORT || 4000;

//?midelwares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

//? Definir las rutas

app.get('/', (req, res) => {
    res.json('usar \n api/:algo')
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/tareas', tareasRoutes);


app.listen(PORT, () => {
    console.log(`El Servidor esta en http://localhost:${PORT}`)
})