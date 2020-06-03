const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');



// luego requerimos crear el nombre de nuestro servidor y pasar la funcion que ejecuta nuestro server express

const app = express();
conectarDB(); // una vez creado nuestro servidor realizamos la conexion a nuestra base de datos 

// habilitar cors
app.use(cors());
// tenemos que habilitar express.js para leer los datos que ingrese el usuario
// para ellos utilizamos el siguiente codigo
app.use(express.json({extended:true}));


// ahora necesitamos asignar un PUERTO a nuestro servidor express

const PORT = process.env.PORT || 4000; // aqui lo que hace es si encuentra un puerto asigado en el .env usalo si no usa el 4000


// importar rutas 

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));


// para probar nuestro servidor en una poagina especifica podemos asignar una pagina y que ejecute https o http

// app.get('/', (req, res) =>{

//     res.send('Hola estamos ejecutando el servidor en modo get yesta es la pagina principal');

// });

//ahora que ya tenemos nuestro puerto asignado pasamos a ejecutar el servidor express

app.listen(PORT, '0.0.0.0', ()=>{

    console.log(`Bienvenido, se encuentra ejecutando el servidor en el puerto: ${PORT}`);

});
