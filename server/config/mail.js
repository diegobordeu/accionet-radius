//
exports.defaultSender = 'Accionet';
exports.defaultSubject = 'Bienvenidos';
let sender_mail = 'test.test@accionet.cl';

if (process.env.NODE_ENV === 'production') {
  sender_mail = 'no.reply@accionet.cl';
}
exports.sender_mail = sender_mail;
exports.mailArray = ['diego@accionet.cl', 'antonio@accionet.cl', 'ivan@accionet.cl', 'santiago@accionet.cl'];
