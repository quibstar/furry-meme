var nodemailer = require('nodemailer');

var smtpConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: false, // use SSL
  auth: {
    user: 'premierbackoffice@gmail.com',
    pass: 'Tucker79!',
  },
};

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(smtpConfig);

exports.sendCreatedUserEmail = function(from, to, subject, text, html) {
  var mailOptions = {
    from: from,
    to: to,
    bcc: 'quibstar@gmail.com',
    subject: subject,
    text: text,
    html: html,
  };

  // console.log(mailOptions);

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log('Mail error: ', error);
    }
    // console.log('Message sent: ' + info.response);
  });
};
