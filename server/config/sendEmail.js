import { Resend } from 'resend';
import dotenv from "dotenv";
dotenv.config();

if(!process.env.RESEND_API_KEY){
    console.log("Provide RESEND_API_KEY inside .env file");
    process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async({sendTo, subject, html}) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Grofers <onboarding@resend.dev>', // This should work for testing
            to: sendTo,
            subject: subject,
            html: html,
        });
        
        if(error){
            console.error('Email sending error:', error);
            return { success: false, error };
        }
        
        console.log('Email sent successfully:', data);
        return { success: true, data };
        
    } catch (error) {
        console.error('Email service error:', error);
        return { success: false, error };
    }
}

export default sendEmail;