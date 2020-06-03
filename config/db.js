const mongoose = require('mongoose');


// rrequerimos el string de conexion 

require('dotenv').config({path: 'variables.env'});

// conectar a la base de datos

const conectarDB = async() =>{

    try {

        await mongoose.connect(process.env.DB_MONGO, {

            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log('DB Conectada');

    } catch (error) {
        console.log(error);
        process.exit(1);
    }


}


module.exports = conectarDB;