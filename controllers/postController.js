const Post = require("../models/PostModel");
const User = require("../models/UserModel");

// get posts
const posts = async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorData",
        },
      },
      {
        $unwind: "$authorData",
      },
    ]);

    if (!posts) {
      return res.status(404).json({
        status: "not found",
        mensaje: "No existen posts por el momento",
      });
    }

    let contador = await Post.countDocuments();

    if (contador === 0) {
      return res.status(204).json({
        mensaje: "Actualmente no hay posts",
      });
    }
    return res.status(200).json({
      total: contador,
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      mensaje: "error en el endpoint POSTING",
    });
  }
};

// creating a post
const createPost = async (req, res) => {
  try {
    const { title, description, author } = req.body;
    const authorFound = await User.findById(author);

    if (!authorFound) {
      return res.status(404).json({
        mensaje: "Error, el author no existe en la base de datos",
      });
    }
    let date = new Date();

    const post = new Post({ title, description, date, author });
    post.save();

    return res.status(200).json({
      mensaje: "post creado",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al intentar subir el post",
    });
  }
};

// deleting a posts
const deletePost = async (req, res) => {
  try {
    const id = req.params.id;

    const eliminado = await Post.findByIdAndDelete(id);
    
    return res.status(200).json({
      mensaje: "post ELIMINADO",
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Ups ocurrio un error en el endpoint DELETE POST",
    });
  }
};

// editar un
const editPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    const updateData = {
      title: title || post.title,
      description: description || post.description,
    };

    if (title || description) {
      updateData.date = new Date();
    }

    const updated = await Post.findByIdAndUpdate(
      postId,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      throw new Error();
    }

    return res.status(200).json({
      mensaje: "Editado con exito",
      updated,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error en el endpoint editPOST",
    });
  }
};

const getPost = async (req, res) => {
  try {
    const id = req.params.id;

    const postFound = await Post.findById(id);
    if (!postFound) {
      return res.status(404).json({
        mensaje: "NOT FOUND",
      });
    }

    return res.status(200).json({
      mensaje: "Post encontrado",
      postFound,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error en el endpoint getPOST",
    });
  }
};

module.exports = {
  posts,
  createPost,
  deletePost,
  editPost,
  getPost,
};
