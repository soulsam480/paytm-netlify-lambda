const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
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
router.post("/", cors(corsOptions), async (req, res) => {
  if (req.body !== {} && req.body.cart.length > 0) {
    const date = `${Date().slice(11, 15)}_${Date().slice(4, 7)}_${Date().slice(
      8,
      10
    )}`;
    await admin
      .database()
      .ref(`/Orders/${date}/${req.body.orderId}`)
      .set(req.body)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(500);
  }
});
app.use("/.netlify/functions/syncOrder", router);
module.exports.handler = serverless(app);
