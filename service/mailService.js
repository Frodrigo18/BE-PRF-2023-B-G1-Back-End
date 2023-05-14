import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import fs from 'fs';
import { RequestStatus } from '../model/enum/requestStatus.js';

dotenv.config();

async function sendRequestMail(toMail, username, status, reason, request) {
  try {
    const year = new Date().getFullYear();
    const statusMail = status == RequestStatus.APPROVED ? "aprobada" : "rechazada"
    const html = fs.readFileSync('/app/html/mail.html', 'utf-8');
    const auxCustomHtml = html
        .replace('{{username}}', username)
        .replace('{{status}}', statusMail)
        .replace('{{year}}', year)
        .replace('{{name}}', request.name)
        .replace('{{serial_number}}', request.serial_number)
        .replace('{{longitude}}', request.longitud)
        .replace('{{latitude}}', request.latitude)
        .replace('{{brand}}', request.brand)
        .replace('{{model}}', request.model)
    
    let customHtml = ''
    if (reason){
      customHtml = auxCustomHtml.replace('{{reason}}', `La razon es la siguiente: ${reason}`);
    }else{
      customHtml = auxCustomHtml.replace('{{reason}}', '');
    }

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_MAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN
      },
    });

    let mailOptions = {
        from:  process.env.GOOGLE_MAIL,
        to: toMail,
        subject: `Su solicitud ha sido ${statusMail.toUpperCase()}`,
        html: customHtml
    };
    
    console.log("sending")
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
}

export {sendRequestMail}