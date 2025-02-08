import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;

    constructor() {
        // Configure the transporter (using Gmail for this example)
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com',   // Replace with your email
                pass: 'your-email-password',     // Replace with your password or app password
            },
        });
    }

    // Send verification email with the code
    async sendVerificationEmail(toEmail: string, verificationCode: string) {
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: toEmail,
            subject: 'Email Verification',
            text: `Your verification code is: ${verificationCode}`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending verification email:', error);
        }
    }
}