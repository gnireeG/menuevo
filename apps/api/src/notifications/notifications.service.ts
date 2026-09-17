import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

const APP_NAME = 'Menuevo';
const APP_URL = process.env.APP_URL ?? 'https://menuevo.tech';

@Injectable()
export class NotificationsService {
    constructor(private readonly mailserService: MailerService){}

    private layoutContext(){
        return {
            appName: APP_NAME,
            appUrl: APP_URL,
            year: new Date().getFullYear(),
        }
    }

    async sendEmailConfirmationMail(options: {email: string, otp: string}){
        await this.mailserService.sendMail({
            to: options.email,
            subject: 'Confirm your email',
            template: 'email-confirmation',
            context: {
                ...this.layoutContext(),
                email: options.email,
                otp: options.otp
            }
        })
    }

    async sendPasswordResetMail(options: {email: string, otp: string}){
        await this.mailserService.sendMail({
            to: options.email,
            subject: 'Reset your password',
            template: 'password-reset',
            context: {
                ...this.layoutContext(),
                email: options.email,
                otp: options.otp
            }
        })
    }
}
