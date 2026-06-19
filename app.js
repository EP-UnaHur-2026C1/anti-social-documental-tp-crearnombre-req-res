const express = require("express");
const dotenv = require("dotenv");
const conectarDB = require("./config/db");
const usersRouter = require("./routes/users.routes");
const postsRouter = require("./routes/posts.routes");

dotenv.config();

const app = express();

app.use(express.json());

conectarDB();

app.get("/", (req, res) => {
  res.send("API red social funcionando");
});

app.use("/users", usersRouter);
app.use("/posts", postsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
