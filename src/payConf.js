const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());
const corsOptions = {
  allowedHeaders: ["Content-Type"],
};
const router = express.Router();

//express code ends here

router.post("/", cors(corsOptions), (req, res) => {
  const paytm_config = require("./paytm/paytm_config").paytm_config;
  const paytm_checksum = require("./paytm/checksum");

  var checksum = req.body.CHECKSUMHASH;
  delete req.body.CHECKSUMHASH;
  if (
    paytm_checksum.verifychecksum(req.body, paytm_config.MERCHANT_KEY, checksum)
  ) {
    if (req.body.STATUS == "TXN_SUCCESS") {
      res.send("<p>Success</p>");
    } else {
      res.send("<p>Transaction failed</p>>");
    }
  } else {
    res.send("<p>failed</p>");
  }
});
app.use("/.netlify/functions/payConf", router);
module.exports.handler = serverless(app);
