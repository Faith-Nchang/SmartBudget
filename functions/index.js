import { useUser } from "@clerk/nextjs";

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp();

// Configure Nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // or another email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const { user } = useUser();


exports.checkBudgets = functions.pubsub.schedule('every 3 minutes').onRun(async (context) => {
  const usersSnapshot = await admin.firestore().collection('users').get();

  alert("function called")
  const emailPromises = [];

  usersSnapshot.forEach(async (userDoc) => {
    const userId = userDoc.id;
    const userData = userDoc.data();
    const budgetCategories = userData.budgetCategories || [];

    budgetCategories.forEach(async (category) => {
      if (category.expenditure > category.total) {
        // Exceeded budget
        const emailOptions = {
          from: process.env.EMAIL_USER,
          to: userData.email,
          subject: 'Budget Exceeded Notification',
          text: `You have exceeded your budget in the ${category.name} category. Please review your expenditures and make more smart financial decisions.`,
        };

        emailPromises.push(transporter.sendMail(emailOptions));
      }
    });
  });

  // Wait for all emails to be sent
  await Promise.all(emailPromises);
  console.log('Budget check completed and notifications sent.');
});
