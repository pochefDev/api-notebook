const mongoose = require("mongoose");

let isConnected;

const database = async () => {
  if (isConnected) {
    console.log("Usando conexión existente a la base de datos");
    return;
  }

  try {
    const db = await mongoose.connect("mongodb://localhost:27017/notebookDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = db.connections[0].readyState;
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.error("Error conectando a la base de datos", error);
    throw error;
  }
};

module.exports = { database };
