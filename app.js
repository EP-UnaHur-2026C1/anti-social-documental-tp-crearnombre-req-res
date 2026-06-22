const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const conectarDB = require("./config/db");
const usersRouter = require("./routes/users.routes");
const postsRouter = require("./routes/posts.routes");
const { conectarRedis } = require("./config/redis");

dotenv.config();

const app = express();

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

conectarDB();
conectarRedis();

app.get("/", (req, res) => {
  res.send("API red social funcionando");
});

app.use("/users", usersRouter);
app.use("/posts", postsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
