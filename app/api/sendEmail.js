import sgMail from '@sendgrid/mail';
import { useUseSr } from '@clerk/nextjs';


sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { user } = useUser()

const TO_EMAIL = user.emailAddresses[0]?.emailAddress;
const FROM_EMAIL = process.env.FROM_EMAIL ?? 'default@gmail.com';



export default async (req, res) => {
    const { email, message } = req.body;
    const msg = {
        to: TO_EMAIL,
        from: FROM_EMAIL,
        subject: 'Mail from ' + email,
        text: message,
        html: message,
    };
    try {
        await sgMail.send(msg);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending email');
    }
};
