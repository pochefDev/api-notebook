const Post = require("../models/PostModel");

const findByName = async (req, res) => {
  try {
    const postTitle = req.params.title;

    if (!postTitle) {
      return res.status(401).json({
        mensaje: "Falta parametro TITLE",
      });
    }

    // Encuentra los posts que coinciden con el título
    const posts = await Post.find({
      title: { $regex: postTitle, $options: "i" },
    });

    if (!posts.length) {
      return res.status(404).json({
        mensaje: "No existen posts con dicho nombre",
      });
    }

    // Realiza una agregación para obtener los detalles del autor
    const postIds = posts.map(post => post._id);
    const detailedPosts = await Post.aggregate([
      {
        $match: { _id: { $in: postIds } }
      },
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

    return res.status(200).json({
      mensaje: "Posts encontrados",
      posts: detailedPosts,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error fatal en el webservice FINDBYNAME",
      error: error.message,
    });
  }
};

module.exports = { findByName };
