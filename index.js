const { database } = require("./database/db");
const express = require("express");
const cors = require("cors");
const {initialSetup}= require("./utilities/initialSetup")

//iniciando app
console.log("Iniciando app");

// base de datos
database();

// servidor de NODE
const app = express();
initialSetup();

// configuraciones de cors
app.use(cors());


// Tranformar el cuerpo de la solicitud (req.body) a objeto JSON para poder manejar la información
app.use(express.json());
app.use(express.urlencoded({extended:true})); // recibe datos por urlencoded (form)

// rutas
const rutas = require("./routes/routes")
app.use("/api-notebook", rutas)


// puerto y escucha de peticiones
app.listen(3000, ()=>{
    console.log("Servidor corriendo en puerto 3000")
})
