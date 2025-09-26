'use server';
/**
 * @fileOverview Flows for customer support, including contact forms and chatbot interactions.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';

// --- Schemas ---

const ContactFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  subject: z.string(),
  message: z.string(),
});

const ChatbotInputSchema = z.object({
  sessionId: z.string(),
  message: z.string(),
});

const ChatbotOutputSchema = z.object({
  reply: z.string(),
  escalationRequired: z.boolean(),
});

const EscalateToHumanSchema = z.object({
  sessionId: z.string(),
  chatHistory: z.array(z.string()),
});

const FlowOutputSchema = z.object({ success: z.boolean(), message: z.string() });

// --- Flows ---

const submitContactFormFlow = ai.defineFlow(
  {
    name: 'submitContactFormFlow',
    inputSchema: ContactFormSchema,
    outputSchema: FlowOutputSchema,
  },
  async (input) => {
    console.log('Received contact form submission:', input.subject);
    // In a real app, this would integrate with a ticketing system like Zendesk or send an email.
    return { success: true, message: 'Your message has been received. We will get back to you shortly.' };
  }
);

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    console.log(`Chatbot received message: "${input.message}"`);
    // This could use a Genkit prompt to generate a helpful response.
    const reply = "I'm a placeholder bot! For real help, we'd need a more powerful AI model. Do you want to escalate?";
    const escalationRequired = input.message.toLowerCase().includes('human');
    return { reply, escalationRequired };
  }
);

const escalateToHumanFlow = ai.defineFlow(
  {
    name: 'escalateToHumanFlow',
    inputSchema: EscalateToHumanSchema,
    outputSchema: FlowOutputSchema,
  },
  async (input) => {
    console.log('Escalating chat to a human agent for session:', input.sessionId);
    // In a real app, this would create a ticket or notify a live agent.
    return { success: true, message: 'A support agent will be with you shortly.' };
  }
);

// --- Exports ---

export async function submitContactForm(input: z.infer<typeof ContactFormSchema>) {
  return await submitContactFormFlow(input);
}

export async function chatbot(input: z.infer<typeof ChatbotInputSchema>) {
  return await chatbotFlow(input);
}

export async function escalateToHuman(input: z.infer<typeof EscalateToHumanSchema>) {
  return await escalateToHumanFlow(input);
}
