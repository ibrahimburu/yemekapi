const nodemailer = require("nodemailer");
const {failure, successfuly} = require('../responses/responses')
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
      return successfuly.email_sended;
    } catch (err) {
        console.log(err);
        console.log({"message":"hata mail gönderilemedi"});
        return failure.email_not_send;
    }
}
const sendmail_forpassword = async(email,token) => {
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
        html:`<p>şifrenizi sıfırlamak için için <a href ="${process.env.URL}/api/resetpassword/${token}" style = "color:red">buraya </a>tıklayın</p>`
      });
      return successfuly.email_sended;
    } catch (err) {
        console.log(err);
        console.log({"message":"hata mail gönderilemedi"});
        return failure.email_not_send;
    }
}
module.exports = {sendmail, sendmail_forpassword};