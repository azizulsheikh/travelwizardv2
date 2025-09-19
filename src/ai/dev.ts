import { config } from 'dotenv';
config();

import '@/ai/flows/generate-initial-trip-plan.ts';
import '@/ai/flows/refine-itinerary.ts';
