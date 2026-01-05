import { NotFoundException } from "#lib/exceptions";
import nodemailer from "nodemailer";

export class EmailService {

    static async sendEmail(email, emailSubject, emailContent) {
        const transporter = nodemailer.createTransport({
            port: 1025,
            secure: false
        });

        const mailOptions = {
            from: 'apiauth@email.com',
            to: email,
            subject: emailSubject != null ? emailSubject : "",
            text: emailContent
        }

        // send email
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                throw new NotFoundException(error)
            }
            else{

            }
        })
    }

}
