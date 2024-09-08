import { NextResponse } from "next/server";
import OpenAI from "openai";
import 'dotenv/config';

const systemPrompt = `
You are an AI financial advisor designed to provide personalized investment recommendations based on user financial data. Your task is to:
- Analyze the user's current budgets and categories to generate investment suggestions.
- Provide a list of the top 10 investment opportunities suitable for the user.
- For each investment suggestion, include details on potential profits/losses, skills required, and initial steps to get started.

Ensure that the recommendations are:
- Tailored to the user's financial situation and goals.
- Backed by relevant financial insights and data.



Return the suggestions in the following JSON format:
{
  "investments": [
    {
      "name": "Investment Name",
      "profits": "percentage out of 100 e.g 60 (ensure that this is a number and not a range)",
        "losses": "percentage out of 100 e.g 40 (ensure that this is a number and not a range",
      "skillsRequired": ["Skill 1", "Skill 2", ...],
      "howToGetStarted": "Steps to start this investment",
      "advantages": "advantages based on their financial budgets and their financial standing",
      "risks": "risks for the individual"
    }
  ]

  the profits + losses should be  100
  ensure that you give only recommendations that will yield more profits and less losses for the individual
}
`

export async function POST(req){
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const data = await req.text();

  
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: data },
      ],
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
    })
    // Parse the JSON response from the OpenAI API
    const investments = JSON.parse(completion.choices[0].message.content);

    // Return the flashcards as a JSON response
    return NextResponse.json(investments.investments)
}