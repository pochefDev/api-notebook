const { model, Schema } = require("mongoose");

const roleSchema = new Schema({
    name: String
});

module.exports = model("Role", roleSchema, "roles");
