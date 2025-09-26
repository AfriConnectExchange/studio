'use server';
/**
 * @fileOverview Flows for sending notifications.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';

// --- Schemas ---

const NotificationSchema = z.object({
  userId: z.string(),
  title: z.string(),
  message: z.string(),
  type: z.enum(['order', 'delivery', 'promo']),
});

const FlowOutputSchema = z.object({ success: z.boolean(), message: z.string() });

// --- Flows ---

const sendNotificationFlow = ai.defineFlow(
  {
    name: 'sendNotificationFlow',
    inputSchema: NotificationSchema,
    outputSchema: FlowOutputSchema,
  },
  async (notification) => {
    console.log(`Sending ${notification.type} notification to ${notification.userId}: "${notification.title}"`);
    // In a real app, this would integrate with a push notification service (e.g., FCM)
    // and write to a 'notifications' subcollection in Firestore.
    return { success: true, message: 'Notification sent successfully.' };
  }
);

// --- Exports ---

export async function sendOrderNotification(input: Omit<z.infer<typeof NotificationSchema>, 'type'>) {
    return await sendNotificationFlow({...input, type: 'order'});
}

export async function sendDeliveryNotification(input: Omit<z.infer<typeof NotificationSchema>, 'type'>) {
    return await sendNotificationFlow({...input, type: 'delivery'});
}

export async function sendPromoNotification(input: Omit<z.infer<typeof NotificationSchema>, 'type'>) {
    return await sendNotificationFlow({...input, type: 'promo'});
}
