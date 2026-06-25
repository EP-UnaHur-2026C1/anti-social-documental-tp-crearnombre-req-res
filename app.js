const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const conectarDB = require("./config/db");
const usersRouter = require("./routes/users.routes");
const postsRouter = require("./routes/posts.routes");
const tagsRouter = require("./routes/tags.routes");
const commentsRouter = require("./routes/comments.routes");
const { conectarRedis } = require("./config/redis");

dotenv.config();

const app = express();

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(cors());

app.get("/", (req, res) => {
  res.send("API red social funcionando");
});

app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/tags", tagsRouter);
app.use("/comments", commentsRouter);

const PORT = process.env.PORT || 3000;

(async () => {
  await conectarDB();
  await conectarRedis();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
})();
