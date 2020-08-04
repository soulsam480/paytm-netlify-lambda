const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const app = express();
app.use(cors());
const corsOptions = {
  allowedHeaders: ["Content-Type"],
};
const router = express.Router();
router.get("/", cors(corsOptions), (req, res) => {
  const name = req.body.name;
  res.statusCode("200").send(`hello ${name}`);
});
app.use("/.netlify/functions/test", router);
module.exports.handler = serverless(app);
