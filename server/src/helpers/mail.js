var transporter = require('../services/mail');
var path  = require('path');
import {EJS} from '../../out/helpers/ejs';

export class AnalyticsMail {

    from    :String;
    to      :String;
    subject :String;
    html    :String;
    template:String;

    static Options = {
        to      :String,
        subject :String,
        html    :String
    }

    static Template = EJS.compile({path:path.join(__dirname,'../mail/index.ejs')});

    constructor(options){
        for(var i in options){
            this[i] = options[i];
        }
        for(var k in AnalyticsMail.Options){
            if(!this.hasOwnProperty(k)){
                throw new Error(`${k} is required`);
            }
        }
    }

    send(reset = false){
        try {
            var mailOptions = {
                from:transporter.config.from,
                to: this.to,
                subject: this.subject,
                html: AnalyticsMail.Template.toString({content:this.html,host:transporter.config.host})
            };

            transporter.sendMail(mailOptions, (error, info)=>{
                if(error && !reset){
                    console.log(error)
                    setTimeout(()=>{
                        this.send(true);
                    },60000);
                    return console.log(error);
                }
                if(info){
                    console.log('Message sent: ' + info.response);
                }

            });
        }catch (e){

        }
    }

    static send(options:VRMail){
        setTimeout(()=>{
            var email = new AnalyticsMail(options);
            email.send();
        });
    }
}

module.exports = AnalyticsMail;