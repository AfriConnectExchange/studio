'use server';
/**
 * @fileOverview Flows for product search and filtering.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';

// --- Schemas ---

const SearchInputSchema = z.object({
  query: z.string(),
});

const FilterInputSchema = z.object({
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  rating: z.number().min(1).max(5).optional(),
});

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  category: z.string(),
  rating: z.number(),
});

const SearchOutputSchema = z.array(ProductSchema);


// --- Flows ---

const searchProductsFlow = ai.defineFlow(
  {
    name: 'searchProductsFlow',
    inputSchema: SearchInputSchema,
    outputSchema: SearchOutputSchema,
  },
  async (input) => {
    console.log(`Searching for products with query: "${input.query}"`);
    // In a real app, this would use a search service like Algolia or Firestore text search.
    return [
      { id: 'PROD-1', name: 'Kente Cloth', price: 125, category: 'textiles', rating: 4.8 },
      { id: 'PROD-2', name: 'Shea Butter', price: 15, category: 'beauty', rating: 4.9 },
    ];
  }
);

const filterProductsFlow = ai.defineFlow(
  {
    name: 'filterProductsFlow',
    inputSchema: FilterInputSchema,
    outputSchema: SearchOutputSchema,
  },
  async (input) => {
    console.log('Filtering products with criteria:', input);
    // In a real app, this would perform a structured query on Firestore.
     return [
      { id: 'PROD-1', name: 'Kente Cloth', price: 125, category: 'textiles', rating: 4.8 },
    ];
  }
);

// --- Exports ---

export async function searchProducts(input: z.infer<typeof SearchInputSchema>) {
  return await searchProductsFlow(input);
}

export async function filterProducts(input: z.infer<typeof FilterInputSchema>) {
  return await filterProductsFlow(input);
}
