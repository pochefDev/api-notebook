const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  roles: [
    {
      ref: "Role",
      type: Schema.Types.ObjectId,
    },
  ],
});

module.exports = model("User", userSchema, "users");
