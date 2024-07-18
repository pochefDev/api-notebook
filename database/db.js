const mongoose = require("mongoose");

const database = async () => {
  try {
    mongoose.connect("mongodb://localhost:27017/notebookDB");
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { database };
