const User = require("../models/UserModel");
const Role = require("../models/RoleModel");

const isAdminRole = async (req, res, next) => {
  const userFound = await User.findById(req.userID);

  if (!userFound) {
    return res.status(404).json({ mensaje: "Usuario no encontrado" });
  }
  const roles = await Role.find({ _id: { $in: userFound.roles } });

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "admin") {
      next();
      return;
    } else {
      return res.status(403).json({ mensaje: "no tienes permiso ADMIN" });
    }
  }
};
module.exports = { isAdminRole };
