const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateAccesstoken(userID) {
  return jwt.sign({ id: userID }, process.env.LLAVE, { expiresIn: "45m" });
}

function validateToken(req, res, next) {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(400).json({
        mensaje: "token no propocionado",
      });
    }
    const decoded = jwt.verify(token, process.env.LLAVE);
    req.userID = decoded.id;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        mensaje: "Token expirado",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        mensaje: "Token inválido",
      });
    }
    console.log("Error en la validación del token:", error);
    return res.status(500).json({
      mensaje: "Error interno del servidor",
    });
  }
}

module.exports = { generateAccesstoken, validateToken };
