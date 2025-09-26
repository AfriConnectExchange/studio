'use server';
/**
 * @fileOverview Flows for creating and managing SME adverts.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';

// --- Schemas ---

const AdvertSchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    content: z.string(),
    imageUrl: z.string().url().optional(),
    isPremium: z.boolean().default(false),
});

const FlowOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  advertId: z.string().optional(),
});

// --- Flows ---

const createAdvertFlow = ai.defineFlow(
  {
    name: 'createAdvertFlow',
    inputSchema: AdvertSchema,
    outputSchema: FlowOutputSchema,
  },
  async (advert) => {
    const newId = `ADVERT-${Date.now()}`;
    console.log('Creating advert:', { ...advert, id: newId });
    // In a real app, you would save this to Firestore.
    return { success: true, message: 'Advert created successfully.', advertId: newId };
  }
);

const editAdvertFlow = ai.defineFlow(
  {
    name: 'editAdvertFlow',
    inputSchema: AdvertSchema.extend({ id: z.string() }),
    outputSchema: FlowOutputSchema,
  },
  async (advert) => {
    console.log('Editing advert:', advert);
    // In a real app, you would update this in Firestore.
    return { success: true, message: 'Advert updated successfully.', advertId: advert.id };
  }
);

const deleteAdvertFlow = ai.defineFlow(
  {
    name: 'deleteAdvertFlow',
    inputSchema: z.object({ advertId: z.string() }),
    outputSchema: FlowOutputSchema,
  },
  async ({ advertId }) => {
    console.log('Deleting advert:', advertId);
    // In a real app, you would delete this from Firestore.
    return { success: true, message: 'Advert deleted successfully.' };
  }
);

const previewAdvertFlow = ai.defineFlow(
  {
    name: 'previewAdvertFlow',
    inputSchema: AdvertSchema,
    outputSchema: z.object({ html: z.string() }),
  },
  async (advert) => {
    // This would typically generate an HTML preview of the advert.
    const html = `
      <div style="border: 1px solid #ccc; padding: 16px; border-radius: 8px;">
        <h2>${advert.title}</h2>
        <p>${advert.content}</p>
        ${advert.isPremium ? '<p><strong>Premium Listing</strong></p>' : ''}
      </div>
    `;
    return { html };
  }
);

// --- Exports ---

export async function createAdvert(input: z.infer<typeof AdvertSchema>) {
  return await createAdvertFlow(input);
}

export async function editAdvert(input: z.infer<typeof AdvertSchema> & { id: string }) {
  return await editAdvertFlow(input);
}

export async function deleteAdvert(input: { advertId: string }) {
  return await deleteAdvertFlow(input);
}

export async function previewAdvert(input: z.infer<typeof AdvertSchema>) {
  return await previewAdvertFlow(input);
}
