'use client';

import { ProductPageComponent } from '@/components/product/product-page';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/dashboard/header';

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const productId = parseInt(params.id, 10);

  const onNavigate = (page: string, newProductId?: number) => {
    if (page === 'product' && newProductId) {
      router.push(`/product/${newProductId}`);
    } else {
      router.push(`/${page}`);
    }
  };

  const onAddToCart = (product: any) => {
    // Implement add to cart logic, e.g., using a global state or context
    console.log('Added to cart:', product);
  };

  return (
    <>
      <Header />
      <ProductPageComponent 
        productId={productId} 
        onNavigate={onNavigate} 
        onAddToCart={onAddToCart} 
      />
    </>
  );
}
