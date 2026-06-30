const Post = require("../models/Post");
const Tag = require("../models/Tag");
const Comment = require("../models/Comment");
const { redisClient } = require("../config/redis");
const { descargarImagen } = require("../utils/imagen.utils");

const agregarImagen = async (req, res) => {
  try {
    const post = req.post; // Se obtiene el post del objeto req, que se supone que ha sido previamente cargado por un middleware. Esto permite acceder al post específico al que se desea agregar la imagen.
    const filename = await descargarImagen(req.body.url); // Se llama a la función descargarImagen con la URL proporcionada en el cuerpo de la solicitud. Esta función descarga la imagen y devuelve el nombre del archivo descargado. Se utiliza await para esperar a que la promesa se resuelva antes de continuar con la ejecución del código.
    post.imagenes.push({ url: `/images/${filename}` }); // Se agrega un objeto con la URL de la imagen descargada al arreglo de imágenes del post. La URL se construye utilizando el nombre del archivo descargado y se asume que las imágenes se sirven desde un directorio público llamado "images". Esto permite asociar la imagen descargada con el post correspondiente.
    await post.save(); // Se guarda el post actualizado en la base de datos. Esto asegura que los cambios realizados en el arreglo de imágenes se persistan y estén disponibles para futuras consultas.

    await redisClient.del(`post:${post._id}`); // Se elimina la entrada en caché del post específico utilizando su ID. Esto asegura que la próxima vez que se solicite este post, se obtenga la versión actualizada desde la base de datos en lugar de la versión en caché obsoleta.
    await redisClient.del("posts"); // Se elimina la entrada en caché de todos los posts. Esto asegura que la próxima vez que se soliciten todos los posts, se obtenga la versión actualizada desde la base de datos en lugar de la versión en caché obsoleta.
    res.status(200).json(post);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Error al agregar la imagen" });
  }
};

const eliminarImagen = async (req, res) => {
  try {
    const post = req.post;
    const { imageId } = req.params;

    const imagenExiste = post.imagenes.some( // Se verifica si la imagen con el ID proporcionado existe en el arreglo de imágenes del post. Esto se hace utilizando el método some, que devuelve true si al menos un elemento del arreglo cumple con la condición especificada.
      (img) => img._id.toString() === imageId, // Se compara el ID de cada imagen en el arreglo con el ID proporcionado en los parámetros de la solicitud. Se utiliza toString() para asegurarse de que ambos IDs sean cadenas de texto antes de compararlos. Esto permite determinar si la imagen que se desea eliminar está asociada al post.
    );
    if (!imagenExiste) { // Si la imagen no existe en el arreglo de imágenes del post, se devuelve una respuesta con un código de estado 404 (No encontrado) y un mensaje de error indicando que la imagen no se encontró en el post. Esto permite informar al cliente que la operación de eliminación no se pudo realizar porque la imagen especificada no está asociada al post.
      return res.status(404).json({ error: "Imagen no encontrada en el post" });
    }

    post.imagenes = post.imagenes.filter( // Se filtra el arreglo de imágenes del post para eliminar la imagen con el ID proporcionado. Esto se hace utilizando el método filter, que crea un nuevo arreglo que incluye solo los elementos que cumplen con la condición especificada.
      (img) => img._id.toString() !== imageId,
    );
    await post.save(); // Se guarda el post actualizado en la base de datos después de eliminar la imagen. Esto asegura que los cambios realizados en el arreglo de imágenes se persistan y estén disponibles para futuras consultas.

    await redisClient.del("posts");
    await redisClient.del(`post:${post._id}`);
    res.status(200).json({
      message: "Imagen eliminada con éxito",
      post: post,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la imagen" });
  }
};

const agregarTag = async (req, res) => {
  try {
    const post = req.post;
    const tag = req.tag;

    const tagIdStr = tag._id.toString();
    const tagExiste = post.tags.some((t) => {
      const idStr = t._id ? t._id.toString() : t.toString();
      return idStr === tagIdStr;
    });

    if (tagExiste) {
      return res
        .status(400)
        .json({ error: "El tag ya está asociado a este post" });
    }

    post.tags.push(tag._id);
    await post.save();
    await redisClient.del("posts");
    await redisClient.del(`post:${post._id}`);
    await post.populate("tags");
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el tag" });
  }
};

const eliminarTag = async (req, res) => {
  try {
    const post = req.post;
    const tag = req.tag;

    const tagIdStr = tag._id.toString();
    const tagExiste = post.tags.some((t) => {
      const idStr = t._id ? t._id.toString() : t.toString();
      return idStr === tagIdStr;
    });

    if (!tagExiste) {
      return res
        .status(404)
        .json({ error: "El tag no está asociado a este post" });
    }

    post.tags = post.tags.filter((t) => {
      const idStr = t._id ? t._id.toString() : t.toString();
      return idStr !== tagIdStr;
    });
    await post.save();

    await redisClient.del("posts");
    await redisClient.del(`post:${post._id}`);
    res.status(200).json({
      message: "Tag eliminado con éxito",
      post: post,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el tag" });
  }
};

// CREAR UN POST
const createPost = async (req, res) => {
  try {
    const { description, userNickname, imagenes, tags } = req.body;

    const newPost = await Post.create({
      description,
      userNickname,
      imagenes: imagenes || [],
      tags: tags || [],
    });

    await redisClient.del("posts");
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//OBTENER TODOS LOS POSTS
const getPosts = async (req, res) => {
  try {

    const posts = await Post.find().populate("tags");
    const todosLosComentarios = await Comment.find();

    const comentariosVisibles = todosLosComentarios.filter(
      (comentario) => comentario.visibilidad,
    );

    const postConComentarios = posts.map((post) => {
      const postObj = post.toObject();
      postObj.comments = comentariosVisibles.filter(
        (comentario) => comentario.postId.toString() === postObj._id.toString(),
      );
      return postObj;
    });

    await redisClient.set("posts", JSON.stringify(posts), { EX: 500 });
    console.log("Posts obtenidos de MongoDB");

    res.json(postConComentarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//OBTENER POST POR ID
const obtenerPostPorId = async (req, res) => {
  try {
    const post = req.post;
    const cacheKey = `post:${post._id}`;

    const postObj = post.toObject();

    const comentariosDelPost = await Comment.find({ postId: postObj._id });
    postObj.comments = comentariosDelPost.filter(
      (comentario) => comentario.visibilidad,
    );

    await redisClient.set(cacheKey, JSON.stringify(postObj), { EX: 500 });
    console.log("Post obtenido de MongoDB");
    res.status(200).json(postObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarPost = async (req, res) => {
  try {
    const postAnt = req.post;
    const cacheKey = `post:${postAnt._id}`;
    const post = await Post.findByIdAndUpdate(postAnt._id, req.body, {
      new: true,
    });
    
    await redisClient.del("posts");
    await redisClient.del(cacheKey);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el post" });
  }
};

//ELIMINAR POST POR ID
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `post:${id}`;
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post no encontrado" });
    }
    await redisClient.del("posts");
    await redisClient.del(cacheKey);
    res.json({ message: "Post eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  deletePost,
  agregarImagen,
  eliminarImagen,
  obtenerPostPorId,
  actualizarPost,
  agregarTag,
  eliminarTag,
};
