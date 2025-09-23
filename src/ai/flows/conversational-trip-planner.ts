'use server';

/**
 * @fileOverview A conversational flow for planning a trip.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { generateInitialTripPlan, type GenerateInitialTripPlanOutput } from './generate-initial-trip-plan';

// Define the schema for a single turn in the conversation
const ConversationTurnSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ConversationTurn = z.infer<typeof ConversationTurnSchema>;


// Define the input schema for the conversational flow
const ConversationalTripPlannerInputSchema = z.object({
  conversation: z.array(ConversationTurnSchema),
});
export type ConversationalTripPlannerInput = z.infer<typeof ConversationalTripPlannerInputSchema>;


// The output can be either a string (for follow-up questions) or the full trip plan
const ConversationalTripPlannerOutputSchema = z.union([
  z.string(),
  z.custom<GenerateInitialTripPlanOutput>(),
]);


export async function conversationalTripPlanner(input: ConversationalTripPlannerInput): Promise<string | GenerateInitialTripPlanOutput> {
  return conversationalTripPlannerFlow(input);
}


const systemPrompt = `You are a friendly and helpful travel agent chatbot. Your goal is to gather all the necessary information from the user to plan their perfect trip.

You must collect the following details:
1.  Origin City or Airport
2.  Destination City or Airport
3.  Departure Date
4.  Return Date (if it's a round trip)
5.  Number of passengers (adults, and optionally children or infants)

Follow these rules:
- Ask one question at a time to not overwhelm the user.
- Be conversational and friendly.
- Analyze the entire conversation history to see what information you already have. Do not ask for information that has already been provided.
- Once you have all five pieces of information, and only then, respond with a single, concise sentence confirming you have everything, like: "Great, I have everything I need to plan your trip to [Destination]! Let me put that together for you." Do not say anything else.
- If the user provides all information in the first message, just give the confirmation sentence.`;


const conversationalTripPlannerFlow = ai.defineFlow(
  {
    name: 'conversationalTripPlannerFlow',
    inputSchema: ConversationalTripPlannerInputSchema,
    outputSchema: ConversationalTripPlannerOutputSchema,
  },
  async ({ conversation }) => {
    const { text } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      system: systemPrompt,
      prompt: { history: conversation },
    });

    // Check if the model's response is a confirmation that it has all the details.
    if (text.includes("I have everything I need")) {
      // If so, synthesize the full trip description and generate the plan.
      const fullTripDescription = conversation.map(turn => turn.content).join(' ');
      const plan = await generateInitialTripPlan({ tripDescription: fullTripDescription });
      return plan;
    } else {
      // Otherwise, return the model's question to the user.
      return text;
    }
  }
);