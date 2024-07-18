const Role = require("../models/RoleModel");

const initialSetup = async () => {
  try {
    const count = await Role.estimatedDocumentCount();

    if (count > 0) return;

    const values = await Promise.all([
      new Role({ name: "normal" }).save(),
      new Role({ name: "admin" }).save(),
    ]);
    console.log(values);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { initialSetup };
