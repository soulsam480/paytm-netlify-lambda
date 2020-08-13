const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const https = require("https");
const paytm_config = require("./paytm/paytm_config").paytm_config;
const paytm_checksum = require("./paytm/checksum");
const PaytmChecksum = require("./paytm/PaytmChecksum");

const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());

const corsOptions = {
  allowedHeaders: ["Content-Type"],
};
const router = express.Router(); //express code ends here

//firebase
/* import * as admin from "firebase-admin"; */
const admin = require("firebase-admin");
const serviceAccount = require("./cred/authKey").authKey;
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ecom-test-53555.firebaseio.com",
    databaseAuthVariableOverride: {
      uid: "lSC134A31NZqjxaEtGvaKfG0PTA3",
    },
  });
}
//firebase
router.post("/", cors(corsOptions), (req, res) => {
  var checksum = req.body.CHECKSUMHASH;
  delete req.body.CHECKSUMHASH;
  if (
    paytm_checksum.verifychecksum(req.body, paytm_config.MERCHANT_KEY, checksum)
  ) {
    console.log("checksum verified local");
    var paytmParams = {};

    paytmParams.body = {
      mid: paytm_config.MID,

      orderId: req.body.ORDERID,
    };

    PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      paytm_config.MERCHANT_KEY
    ).then(function (checksum) {
      paytmParams.head = {
        signature: checksum,
      };
      console.log("generated signature");
      var post_data = JSON.stringify(paytmParams);

      var options = {
        hostname: "securegw-stage.paytm.in",

        /* for Production */
        // hostname: 'securegw.paytm.in',

        port: 443,
        path: "/v3/order/status",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": post_data.length,
        },
      };
      console.log("this is before request");
      var response = "";
      var post_req = https.request(options, function (post_res) {
        post_res.on("data", function (chunk) {
          response += chunk;
        });
        post_res.on("end", async () => {
          console.log("from paytm");
          const resBody = JSON.parse(response);
          const paytm_response = resBody.body.resultInfo;
          if (paytm_response.resultStatus === "TXN_SUCCESS") {
            console.log("isSuccess");
            const date = `${Date().slice(11, 15)}_${Date().slice(
              4,
              7
            )}_${Date().slice(8, 10)}`;
            console.log(date);
            await admin
              .database()
              .ref(`/Orders/${date}/${req.body.ORDERID}`)
              .set({
                orderId: req.body.ORDERID,
              })
              .then(() => {
                console.log("sending data");
                res.send(
                  `<script>window.location ='https://tiaamo.com/order/?paytm_response=${paytm_response.resultStatus}' </script>`
                );
              })
              .catch((err) => {
                console.log(err);
                ("<script>window.location ='https://tiaamo.com/cart' </script>");
              });
          } else if (paytm_response.resultStatus === "TXN_FAILURE") {
            console.log("isFailure");
            res.send(
              "<script>window.location ='https://tiaamo.com/cart'</script>"
            );
          }
        });
      });

      post_req.write(post_data);
      post_req.end();
    });
  } else {
    res.send("<script>window.location ='http://tiaamo.com/cart' </script>");
  }
});
app.use("/.netlify/functions/payConf", router);
module.exports.handler = serverless(app);
