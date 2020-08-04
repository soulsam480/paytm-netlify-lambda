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
  const myFun = require("./utils/myFunc");
  //code starts here
  var random = Math.floor(Math.random() * 999999).toString();
  var amount = req.body.amount;
  var name = req.body.name;
  var email = req.body.email;
  var mobile = req.body.mobile;
  var orderid = req.body.orderid;

  if (amount == undefined) {
    res.send("Amount is Mandatory.");
  }

  if (name == undefined) {
    name = "CUST" + random;
  }
  if (email == undefined) {
    email = "email" + Math.floor(Math.random() * 999999).toString() + "@na.com";
  }
  if (mobile == undefined) {
    mobile = "9999" + random;
  }
  if (orderid == undefined) {
    orderid = "ORDER" + random;
  }

  var paramarray = {};
  paramarray["MID"] = paytm_config.MID; //Provided by Paytm
  paramarray["ORDER_ID"] = orderid.replace(" ", "-"); //unique OrderId for every request
  paramarray["CUST_ID"] = name.replace(" ", "-"); // unique customer identifier
  paramarray["INDUSTRY_TYPE_ID"] = paytm_config.INDUSTRY_TYPE_ID; //Provided by Paytm
  paramarray["CHANNEL_ID"] = paytm_config.CHANNEL_ID; //Provided by Paytm
  paramarray["TXN_AMOUNT"] = amount; // transaction amount
  paramarray["WEBSITE"] = paytm_config.WEBSITE; //Provided by Paytm
  paramarray["CALLBACK_URL"] = paytm_config.CALLBACK_URL; //Provided by Paytm
  paramarray["EMAIL"] = email.replace(" ", "-"); // customer email id
  paramarray["MOBILE_NO"] = mobile; // customer 10 digit mobile no.
  paytm_checksum.genchecksum(paramarray, paytm_config.MERCHANT_KEY, function (
    err,
    checksum
  ) {
    res.send(
      myFun.returnPage(paramarray, checksum, paytm_config.PAYTM_ENVIRONMENT)
    );
  });
});
app.use("/.netlify/functions/payment", router);
module.exports.handler = serverless(app);
