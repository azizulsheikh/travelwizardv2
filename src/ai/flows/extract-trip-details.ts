'use server';

/**
 * @fileOverview Extracts key travel details from a user's description.
 *
 * - extractTripDetails - A function that takes a trip description and returns structured details.
 * - ExtractTripDetailsInput - The input type for the function.
 * - ExtractTripDetailsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractTripDetailsInputSchema = z.object({
  tripDescription: z.string().describe('A text description of the desired trip.'),
});
export type ExtractTripDetailsInput = z.infer<typeof ExtractTripDetailsInputSchema>;

const ExtractTripDetailsOutputSchema = z.object({
  originCity: z.string().optional().describe('The starting city of the trip.'),
  destinationCity: z.string().optional().describe('The main destination city of the trip.'),
  departureDate: z.string().optional().describe('The departure date in YYYY-MM-DD format.'),
  returnDate: z.string().optional().describe('The return date in YYYY-MM-DD format.'),
});
export type ExtractTripDetailsOutput = z.infer<typeof ExtractTripDetailsOutputSchema>;

export async function extractTripDetails(input: ExtractTripDetailsInput): Promise<ExtractTripDetailsOutput> {
  return extractTripDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractTripDetailsPrompt',
  input: { schema: ExtractTripDetailsInputSchema },
  output: { schema: ExtractTripDetailsOutputSchema },
  prompt: `You are an expert at extracting specific pieces of information from a user's travel request.

Analyze the following trip description and pull out the requested fields.
- Only fill in a field if the information is explicitly mentioned.
- Do not make up any information.
- If a date is mentioned, convert it to YYYY-MM-DD format. Assume the current year if not specified.

User's Trip Description:
"{{tripDescription}}"
`,
});

const extractTripDetailsFlow = ai.defineFlow(
  {
    name: 'extractTripDetailsFlow',
    inputSchema: ExtractTripDetailsInputSchema,
    outputSchema: ExtractTripDetailsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
