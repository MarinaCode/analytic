var config  = require( '../../config');
var mailer = require('nodemailer');
var smtpTransport =  require('nodemailer-smtp-transport');

const service = config.services['mail'];
var smtpConfig = {
    host: service.hostname,
    port: service.port,
    secure: false, // use SSL
    auth: {
        user: service.user,
        pass: service.pass
    },
    tls: {
        rejectUnauthorized: false
    }
};
var transporter;
if(config.env == 'local'){
    transporter = mailer.createTransport(service.protocol+'://'+service.user+':'+service.pass+'@'+service.hostname);
}else{
    transporter = mailer.createTransport(smtpTransport(smtpConfig));
}
transporter.config = service;

module.exports = transporter;