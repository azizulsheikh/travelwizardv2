# **App Name**: TripWeaver AI

## Core Features:

- Initial Trip Plan Generation: Generates an initial travel itinerary based on the user's text prompt using a generative AI model, via the OpenRouter API. The model reasons to combine several data sources in creating the plan: general knowledge, amadeus flights and hotel availability, user preferences from the prompt. This acts as a tool in formulating a well-informed output.
- Itinerary Refinement: Allows users to refine the generated itinerary through follow-up requests, also processed by the AI model.
- Real-time Flight Details: Displays real-time flight information using the Amadeus Flight API.
- Hotel Recommendations: Provides hotel recommendations using the Amadeus Hotel API.
- Interactive Itinerary Display: Presents the itinerary in a clear and interactive format, with a left sidebar for chat and a right section for the itinerary.
- Loading State UI: Displays informative loading messages and skeleton loaders during AI processing.
- Unsplash Images: Includes relevant images from Unsplash based on activity descriptions to enhance visual appeal.

## Style Guidelines:

- Primary color: Blue (#3498DB), used for primary buttons and key accents, reflecting travel and trustworthiness.
- Background color: Light gray (#F3F3F3), providing a neutral backdrop that emphasizes the content.
- Accent color: A slightly darker blue (#2980B9) used on button hovers, borders, and interactive elements, providing visual feedback.
- Body and headline font: 'Inter', a versatile sans-serif, providing a clean and modern feel suitable for both headings and body text.
- Simple, outline-style icons to represent different activity types, ensuring clarity and visual consistency.
- Use a responsive, split-screen layout with a left sidebar for input and a right panel for displaying the itinerary.
- Subtle animations during data loading and transitions, enhancing the user experience without being intrusive.