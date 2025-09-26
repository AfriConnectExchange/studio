'use server';
/**
 * @fileOverview Flows for handling money remittances.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';

// --- Schemas ---

const RemittanceSchema = z.object({
  senderId: z.string(),
  recipientId: z.string().optional(),
  recipientEmail: z.string().email().optional(),
  amount: z.number(),
  currency: z.string(),
  provider: z.enum(['Wise', 'PayPal', 'Stripe', 'Flutterwave']),
});

const TransactionSchema = z.object({
  id: z.string(),
  amount: z.number(),
  date: z.string().datetime(),
  status: z.string(),
  recipient: z.string(),
});

const FlowOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  transactionId: z.string().optional(),
});

// --- Flows ---

const sendRemittanceFlow = ai.defineFlow(
  {
    name: 'sendRemittanceFlow',
    inputSchema: RemittanceSchema,
    outputSchema: FlowOutputSchema,
  },
  async (input) => {
    const transactionId = `REM-${Date.now()}`;
    console.log(`Sending ${input.amount} ${input.currency} via ${input.provider}`);
    // In a real app, integrate with the selected provider's API.
    return { success: true, message: 'Remittance initiated successfully.', transactionId };
  }
);

const receiveRemittanceFlow = ai.defineFlow(
  {
    name: 'receiveRemittanceFlow',
    inputSchema: z.object({ transactionId: z.string(), recipientId: z.string() }),
    outputSchema: FlowOutputSchema,
  },
  async (input) => {
    console.log(`Recipient ${input.recipientId} is claiming transaction ${input.transactionId}`);
    // In a real app, update the transaction status in Firestore.
    return { success: true, message: 'Remittance claimed.' };
  }
);

const getRemittanceHistoryFlow = ai.defineFlow(
  {
    name: 'getRemittanceHistoryFlow',
    inputSchema: z.object({ userId: z.string() }),
    outputSchema: z.array(TransactionSchema),
  },
  async ({ userId }) => {
    console.log(`Fetching remittance history for user: ${userId}`);
    // In a real app, query the transactions collection in Firestore.
    return [
        { id: 'REM-123', amount: 100, date: new Date().toISOString(), status: 'Completed', recipient: 'Jane Doe' }
    ];
  }
);

// --- Exports ---

export async function sendRemittance(input: z.infer<typeof RemittanceSchema>) {
  return await sendRemittanceFlow(input);
}

export async function receiveRemittance(input: { transactionId: string, recipientId: string }) {
  return await receiveRemittanceFlow(input);
}

export async function getRemittanceHistory(input: { userId: string }) {
  return await getRemittanceHistoryFlow(input);
}
