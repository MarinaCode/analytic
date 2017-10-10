var EventEmitter = require('events');
var _ = require('underscore');
var transporter = require('../services/mail');
var AnalyticsMail = require('../../out/helpers/mail');
import {EJS} from '../../out/helpers/ejs';
var path = require('path');

class Emitter extends EventEmitter{
    constructor(){
        super();
        this.on('sendMail:verify', this.onSendVerifyMail);
        this.on('sendMail:forgetPwd', this.onSendForgetPwd);
        this.on('sendMail:contact-us',this.onSendEmailContactUs);
    }

    onSendVerifyMail(result){
        try {
            AnalyticsMail.send({
                to: result.email,
                subject: 'Email Verification',
                html: EJS.compile({
                    path: path.join(__dirname, '../mail/confirm.ejs'),
                    data: {
                        first_name : (result.first_name || 'There'),
                        host       : transporter.config.host,
                        link       : `${transporter.config.host}/activation/${result.activation_code}`
                    }
                })
            })

        } catch (e){
            console.log(e);
        }
    }

    onSendForgetPwd(result){
        try {
            AnalyticsMail.send({
                to: result.email,
                subject: 'Reset Analytics Status Password',
                html: EJS.compile({
                    path: path.join(__dirname, '../mail/reset.ejs'),
                    data: {
                        first_name :(result.first_name || 'There'),
                        last_name  :(result.last_name || ''),
                        link       :`${transporter.config.host}/reset-password/${result.reset_password_code}`
                    }
                })
            })

        }catch (e){
            console.log(e);
        }
    }

    onSendEmailContactUs(result){
        try {
            AnalyticsMail.send({
                to:'contact@madcrocs.com',
                subject:result.subject,
                html:EJS.compile({
                    path:path.join(__dirname,'../mail/contactus.ejs'),
                    data:result
                })
            })
        }catch (e){
            console.log(e);
        }
    }

}

export default new Emitter();