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
  /*   const name = req.body.name;
   */ res.sendStatus(404);
  /*   res.send("yoyo");
   */
});
app.use("/.netlify/functions/test", router);
module.exports.handler = serverless(app);
