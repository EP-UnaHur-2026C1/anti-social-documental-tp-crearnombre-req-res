const Post = require("../models/Post");
const { redisClient } = require("../config/redis");
const { actualizarPostSchema, postSchema } = require("../schemas/post.schema");

const validarPost = (req, res, next) => {
  const { error } = postSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: "Estructura de post no valida" });
  }
  next();
};

const validarPostId = async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate("tags").populate("comments");
  if (!post) {
    return res.status(404).json({ error: "Post no encontrado" });
  }
  req.post = post;
  next();
};

const cachePostPorId = async (req, res, next) => {
  const cacheKey = `post:${req.post._id}`;
  const postEnCache = await redisClient.get(cacheKey);
  if (postEnCache) {
    console.log("Post obtenido de Redis");
    return res.status(200).json(JSON.parse(postEnCache));
  }
  next();
};

const validarActualizarPost = (req, res, next) => {
  const { error } = actualizarPostSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: "Estructura de post no valida" });
  }
  next();
};

module.exports = {
  validarPost,
  validarPostId,
  cachePostPorId,
  validarActualizarPost,
};
