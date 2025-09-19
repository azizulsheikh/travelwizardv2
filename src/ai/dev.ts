import { config } from 'dotenv';
config();

import '@/ai/flows/refine-generated-itinerary.ts';
import '@/ai/flows/generate-initial-trip-plan.ts';