import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';
import env from '../services/env';

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
const mailgunOptions: mg.Options = {
  auth: {
    api_key: env.mailGunApiKey,
    domain: env.mailGunUsername,
  },
};
export default nodemailer.createTransport(mg(mailgunOptions));
