const nodemailer = require("nodemailer");
require('dotenv').config();

const sendmail = async(email,id) => {
    try {
        let transporter =nodemailer.createTransport({
            host: "smtp.mail.ru",
            port: 465,
            secure: true, 
        auth: {
            user: process.env.USER,
            pass: process.env.PASS, 
        }
    })
    await transporter.sendMail({
        from: '"buruSoftware 👻" <buru2425@mail.ru>', // sender address
        to: email, // list of receivers
        subject: "mail doğrulama", // Subject line
        html:`<p>mailinizi doğrulmak için <a href ="${process.env.URL}/api/verify/${id}" style = "color:red">buraya </a>tıklayın</p>`
      });
    } catch (err) {
        console.log(err);
        console.log({"message":"hata mail gönderilemedi"});
    }
}
module.exports = sendmail;