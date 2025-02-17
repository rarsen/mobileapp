import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as postmark from 'postmark';

@Injectable()
export class EmailService {
    private client: postmark.ServerClient;

    constructor() {
        if (!process.env.POSTMARK_API_KEY || !process.env.POSTMARK_FROM_EMAIL) {
            throw new Error('Postmark API key or sender email is missing in environment variables');
        }
        this.client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
    }

    async sendVerificationEmail(email: string, token: string): Promise<void> {
        try {
            const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`;
            await this.client.sendEmail({
                From: process.env.POSTMARK_FROM_EMAIL as string,
                To: email,
                Subject: 'Verify your email',
                HtmlBody: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
                MessageStream: 'outbound',
            });
        } catch (error) {
            console.error('Error sending verification email:', error);
            throw new InternalServerErrorException('Failed to send verification email');
        }
    }
}
