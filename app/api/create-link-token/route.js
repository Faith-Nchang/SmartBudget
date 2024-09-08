// app/api/create-link-token/route.js
import { plaidClient } from "@/lib/plaid";

export async function POST(req, res) {
  try {
    console.log("PLAID_CLIENT_ID:", process.env.PLAID_CLIENT_ID);
    console.log("PLAID_SANDBOX_REDIRECT_URI:", process.env.PLAID_SANDBOX_REDIRECT_URI);

    if (!process.env.PLAID_CLIENT_ID || !process.env.PLAID_SANDBOX_REDIRECT_URI) {
      throw new Error("Missing required environment variables.");
    }

    const tokenResponse = await plaidClient.linkTokenCreate({
      user: { client_user_id: process.env.PLAID_CLIENT_ID },
      client_name: "SmartBudget Finance App",
      language: 'en',
      products: ['auth'],
      country_codes: ['US'],
      redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
    });

    return res.status(200).json(tokenResponse.data);
  } catch (error) {
    console.error("Error creating link token:", error.message);
    return res.status(500).json({ error: "An error occurred while creating the link token" });
  }
}
