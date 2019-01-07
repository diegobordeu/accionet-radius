const nodemailer = require('nodemailer');
const mailConfig = require('../config/mail');
const sender_mail = require('../config/mail').sender_mail;

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: '465',
  secure: true,
  auth: {
    user: sender_mail,
    pass: process.env.ACCIONET_MAIL_PASSWORD,
  },
});
//
const getOptions = function (mail, text, subject) {
  return new Promise((resolve, reject) => {
    const mailSender = mailConfig.defaultSender;
    const content = {
      from: `${mailSender}<${sender_mail}>`, // sender address
      to: mail,  // list of receivers
      subject, // Subject line
      text, // plain text body
      html: text, // html body
    };
    if (text === null || text === undefined || text === '') {
      return reject('fail because mail_content was empty');
    }
    resolve(content);
  });
};

exports.getOptions = getOptions;

exports.send = function (mail, text, subject) {
  if (!mail[0]) {
    return;
  }
  return new Promise((resolve, reject) => {
    nodemailer.createTestAccount((err) => {
      if (err) {
        return reject(err);
      }
      getOptions(mail, text, subject).then((options) => {
        transporter.sendMail(options, (error, info) => {
          if (error) {
            return reject(error);
          }
          return resolve(info);
        });
      }).catch((err) => {
        reject(err);
      });
    });
  });
};
