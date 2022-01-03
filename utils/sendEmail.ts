import nodemailer from 'nodemailer';

interface IMailOptions {
    to: string,
    subject: string,
    message: string,
    html?: string
}

export default async function sendEmail ({ to, subject, message, html }: IMailOptions ) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'stanford.wintheiser96@ethereal.email',
            pass: 'Sh1DmkUfjBBnVDqNdX'
        }
    });

    return await transporter.sendMail({
        from: 'test',
        to,
        subject,
        text: message,
        html: html??'',
    });
}
