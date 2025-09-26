'use server';
/**
 * @fileOverview Flows for order tracking and status updates.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';

// --- Schemas ---

const TrackingEventSchema = z.object({
    status: z.string(),
    description: z.string(),
    location: z.string(),
    timestamp: z.string().datetime(),
});

const OrderStatusSchema = z.object({
  orderId: z.string(),
  status: z.enum(['processing', 'shipped', 'in-transit', 'delivered', 'failed']),
  trackingNumber: z.string().optional(),
  events: z.array(TrackingEventSchema),
});

const UpdateDeliveryStatusInputSchema = z.object({
  orderId: z.string(),
  status: z.string(),
  location: z.string(),
  description: z.string(),
});

// --- Flows ---

const trackOrderFlow = ai.defineFlow(
  {
    name: 'trackOrderFlow',
    inputSchema: z.object({ orderId: z.string() }),
    outputSchema: OrderStatusSchema.nullable(),
  },
  async ({ orderId }) => {
    console.log(`Tracking order: ${orderId}`);
    // In a real app, you would fetch this from Firestore or a shipping provider's API.
    if (orderId === 'ORD-123') {
        return {
            orderId,
            status: 'in-transit',
            trackingNumber: 'TRK-456',
            events: [
                { status: 'In Transit', description: 'Departed from hub', location: 'London, UK', timestamp: new Date().toISOString() },
                { status: 'Shipped', description: 'Package picked up by courier', location: 'Lagos, NG', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
            ]
        };
    }
    return null;
  }
);

const updateOrderStatusFlow = ai.defineFlow(
  {
    name: 'updateOrderStatusFlow',
    inputSchema: z.object({ orderId: z.string(), status: OrderStatusSchema.shape.status }),
    outputSchema: z.object({ success: z.boolean() }),
  },
  async ({ orderId, status }) => {
    console.log(`Updating order ${orderId} status to ${status}`);
    // In a real app, update the order document in Firestore.
    return { success: true };
  }
);

const updateDeliveryStatusInternalFlow = ai.defineFlow(
  {
    name: 'updateDeliveryStatusInternalFlow',
    inputSchema: UpdateDeliveryStatusInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async (input) => {
    console.log(`Adding delivery event to order ${input.orderId}: ${input.status}`);
    // In a real app, add a new event to the order's tracking subcollection.
    return { success: true };
  }
);


// --- Exports ---

export async function trackOrder(input: { orderId: string }) {
  return await trackOrderFlow(input);
}

export async function updateOrderStatus(input: { orderId: string, status: z.infer<typeof OrderStatusSchema.shape.status> }) {
  return await updateOrderStatusFlow(input);
}

export async function updateDeliveryStatus(input: z.infer<typeof UpdateDeliveryStatusInputSchema>) {
  return await updateDeliveryStatusInternalFlow(input);
}
