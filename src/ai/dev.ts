'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/generate-initial-trip-plan';
import '@/ai/flows/refine-itinerary';
import '@/ai/flows/refine-generated-itinerary';
