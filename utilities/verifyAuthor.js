const Post = require("../models/PostModel");

const isRealAuthor = async (req, res, next) => {
  const postId = req.params.id;
  const authorId = req.headers["author-id"];

  if (!postId) {
    return res.status(400).json({
      mensaje: "Falta el parametro ID del post",
    });
  }

  if (!authorId) {
    return res.status(400).json({
      mensaje: "Falta el header AUTHOR ID para verificar el creador",
    });
  }

  const postFound = await Post.findById(postId);

  if (!postFound) {
    return res.status(404).json({
      mensaje: "Post no encontrado",
    });
  }

  if (postFound.author.toString() !== authorId) {
    return res.status(403).json({
      mensaje: "No eres dueño del POST, no puedes modificarlo",
    });
  } else {
    next();
  }
};
module.exports = { isRealAuthor };
