const admin = require("firebase-admin");
const notification = {
  title: "ssdfdfg",
  body: "dvsgsdfgsddf",
  imageUrl:"https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-980x653.jpg"
}
const privateKey =  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: privateKey,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const sendPushNotification = (registrationToken, message) => {
  const payload = {
    notification: {
      title: message.title,
      body: message.body,
      imageUrl: message.imageUrl
    },
    token: registrationToken
  };
  admin.messaging().send(payload)
    .then(response => {
      console.log('Push bildirimi gönderildi:', response);
    })
    .catch(error => {
      console.error('Push bildirimi gönderilemedi:', error);
    });
};
module.exports = { sendPushNotification };
//sendPushNotification('cdYoA3U9ScaWZssNBHR-zJ:APA91bFFVijIH6var3kE2-56A6ebIJcJ8jacoFuUHNI6_Nulq2kzvf1ClPC2gD5nmudSj0TrSXcCGbTlCiwMZ7G_d4h9ycrcFciyqfZDeCsYm-BG-ZmpDak1rBaZKGC8CeUzxtkDEWcE', notification)
