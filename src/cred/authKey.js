const { PRIVATE_KEY } = process.env;
const { PRIVATE_KEY_ID } = process.env;
const { CERT_URL } = process.env;
module.exports = {
  authKey: {
    type: "service_account",
    project_id: "ecom-test-53555",
    private_key_id: PRIVATE_KEY_ID,
    private_key: PRIVATE_KEY,
    client_email:
      "firebase-adminsdk-ijb5q@ecom-test-53555.iam.gserviceaccount.com",
    client_id: "101621889260973490183",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: CERT_URL,
  },
};
