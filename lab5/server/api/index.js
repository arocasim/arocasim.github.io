const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// тестовий маршрут
app.get("/api/recipes", (req, res) => {
  res.json([{ name: "Піца" }, { name: "Борщ" }]);
});

module.exports = (req, res) => {
  app(req, res);
};
