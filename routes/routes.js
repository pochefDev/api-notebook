const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const { validateToken } = require("../utilities/token");
const PostController = require("../controllers/postController");
const { isAdminRole } = require("../utilities/verifyRoles");
const { isRealAuthor } = require("../utilities/verifyAuthor");
const Busqueda = require("../controllers/busquedaService");

// rutas para inicio de sesion
router.post("/log-user", UserController.userLog);
router.post("/register-user", UserController.singup);
router.get("/prueba", [validateToken, isAdminRole], UserController.prueba);
router.post("/close-sesion", UserController.logout);

// catalogo de usuarios
router.get("/users", UserController.getAllUsers);
router.put(
  "/edit-user/:id",
  [validateToken, isAdminRole],
  UserController.updateOne
);
router.delete(
  "/delete-user/:id",
  [validateToken, isAdminRole],
  UserController.deleteOne
);
router.get("/get-user/:id", UserController.getOneUser);

//rutas publicaciones de posts
router.get("/posts", PostController.posts);
router.post("/creating-post", PostController.createPost);
router.delete("/delete-post/:id", [isRealAuthor], PostController.deletePost);
router.put("/edit-post/:id", [isRealAuthor],PostController.editPost);
router.get("/get-post/:id", PostController.getPost);

// web-service
router.get("/find-by-title/:title", Busqueda.findByName);

module.exports = router;
