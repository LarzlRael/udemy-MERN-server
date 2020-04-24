require('dotenv').config({ path: 'variables.env' });
const mongoose = require('mongoose');

const conectarDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('base de datos conectada');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}


module.exports = conectarDatabase;
