const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (error) => {
  console.error("Error en Redis:", error);
});

const conectarRedis = async () => {
  await redisClient.connect();
  console.log("Redis conectado");
};

module.exports = {
  redisClient,
  conectarRedis,
};
