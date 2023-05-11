import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import fs from 'fs';
import { RequestStatus } from '../model/enum/requestStatus.js';
import path from 'path';

dotenv.config();

async function sendMail(toMail, username, status, reason) {
  try {
    const html = fs.readFileSync('/app/html/mail.html', 'utf-8');

    const customHtml = html
        .replace('{{username}}', username)
        .replace('{{status}}', status == RequestStatus.APPROVED ? "aprobada" : "rechazada")
    
    if (reason){
        customHtml
            .replace('{{reason}}', `La razon es la siguiente: ${reason}`);
    }else{
        customHtml
            .replace('{{reason}}', '');
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
        subject: 'Asunto del correo',
        html: customHtml
    };
      

    let info = await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado: ' + info.response);
  } catch (error) {
    console.log(error);
  }
}

export {sendMail}