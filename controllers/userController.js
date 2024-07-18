const User = require("../models/UserModel");
const Role = require("../models/RoleModel");
const bcrypt = require("bcrypt");
const { generateAccesstoken, destroyToken } = require("../utilities/token");

// ENDPOINTS para inicio de sesion
const userLog = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email: email }).populate();
    // busqueda en la bd de la existencia de un usuario con tal email proporcionado
    if (!userFound) {
      return res.status(404).json({
        status: "error 404",
        mensaje: "usuario no encontrado",
      });
    }

    // se comparan las contraseñas la que viene del body (se hashea) con la contraseña encryptada en la bd
    // el proceso de hashear la contraseña es irreversible
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "error 401",
        mensaje: "correo o contraseña incorrecta",
      });
    }
    req.email = userFound.email;
    const accesToken = generateAccesstoken(userFound._id);

    return res.status(200).header("x-access-token", accesToken).json({
      status: "success 200",
      mensaje: "login correcto",
      token: accesToken,
      user: userFound,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error 500",
      mensaje: "error al inicar sesion",
      error: error.message,
    });
  }
};

const singup = async (req, res) => {
  const { username, email, password, roles } = req.body;

  try {
    passwordSegura = await bcrypt.hash(password, 10);

    const datos = {
      username: username,
      email: email,
      password: passwordSegura,
    };
    // instancia al objeto con los datos del body y password encryptada
    const user = new User(datos);
    const duplicado = await User.findOne({ email: email }).populate();
    if (duplicado) {
      return res.status(400).json({
        status: "error 400",
        mensaje: "ya existe un correo igual",
      });
    }
    if (roles) {
      const rol = await Role.find({ name: { $in: roles } });
      user.roles = rol.map((role) => role._id);
    } else {
      const rol = await Role.findOne({ name: "normal" });
      user.roles = [rol._id];
    }

    // se guarda el objeto en la bd
    user.save();

    return res.status(200).json({
      status: "success 200",
      mensaje: "usuario registrado",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error 500",
      mensaje: "error al registrar usuario",
    });
  }
};

const logout = (req, res) => {
  return res.status(200).json({
    status: "success",
    mensaje: "sesion terminada",
  });
};

// endpoint con validacion de token
const prueba = (req, res) => {
  return res.json({
    mensaje: "consulta permitida",
  });
};

// CRUD DE USUARIOS
const getAllUsers = async (req, res) => {
  try {
    const usuarios = await User.find({}).populate();

    if (!usuarios) {
      return res.status(404).json({
        status: "not found",
        mensaje: "no existe informacion en la BD (coleccion usuarios)",
      });
    }
    return res.status(200).json({
      status: "success",
      usuarios,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      mensaje: "Error en el endpoint GET ALL USERS",
    });
  }
};

const updateOne = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        status: "Error",
        mensaje: "Se necesita un ID para poder ejecutar la función",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: "Error",
        mensaje: "Usuario no encontrado",
      });
    }

    // Validar que no haya duplicidades en el email solo si se va a actualizar
    if (email && email !== user.email) {
      const duplicado = await User.findOne({ email: email });
      if (duplicado) {
        return res.status(401).json({
          status: "Error",
          mensaje: "Ya existe un usuario con ese email",
        });
      }
    }

    const updateData = {
      username: username || user.username,
      email: email || user.email,
      password: password ? await bcrypt.hash(password, 10) : user.password,
    };

    // Si se proporcionaron roles, actualizarlos
    if (roles) {
      const rolesFound = await Role.find({ name: { $in: roles } });
      updateData.roles = rolesFound.map(role => role._id);
    }

    const update = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!update) {
      throw new Error();
    }

    return res.status(200).json({
      status: "Success",
      mensaje: "Usuario actualizado",
      usuario: update,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      mensaje: "Error en el endpoint UPDATE ONE",
    });
  }
};

const deleteOne = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({
        status: "Error",
        mensaje: "falta proporcionar el ID a eliminar",
      });
    }

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        status: "not found",
        mensaje: "usuario no encontrado",
      });
    }

    return res.status(200).json({
      status: "success",
      mensaje: "usuario eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      mensaje: "Error en el endpoint DELETE ONE",
    });
  }
};

const getOneUser = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(401).json({
        status: "Error",
        mensaje: "falta proporcionar el ID a eliminar",
      });
    }

    const userfound = await User.findById(id);

    if (!userfound) {
      return res.status(404).json({
        status: "not found",
        mensaje: "usuario no encontrado",
      });
    }
    return res.status(200).json({
      status: "success",
      mensaje: "usuario encontrado",
      userfound,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      mensaje: "Error en el endpoint GET ONE USER",
    });
  }
};

module.exports = {
  userLog,
  singup,
  logout,
  prueba,
  getAllUsers,
  updateOne,
  deleteOne,
  getOneUser,
};
