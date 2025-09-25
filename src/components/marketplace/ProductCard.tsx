'use client';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import Image from 'next/image';
import { FreeListingBadge } from './ListingBadges';
import { motion } from 'framer-motion';
import type { Product } from '@/app/marketplace/page';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string, productId?: number) => void;
  onAddToCart: (product: any) => void;
  animationDelay?: number;
  currency?: string;
}

export function ProductCard({
  product,
  onNavigate,
  onAddToCart,
  animationDelay = 0,
  currency = '£',
}: ProductCardProps) {
  const formatPrice = (price: number) => `${currency}${price.toLocaleString()}`;

  const handleAddToCart = () => {
    if (product.isFree) {
      onNavigate('product', product.id);
      return;
    }

    onAddToCart({
      ...product,
      quantity: 1,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: animationDelay }}
      className="h-full"
    >
      <Card className="group border-border/60 hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden">
        <CardContent className="p-0 flex-1 flex flex-col">
          <div className="relative overflow-hidden">
            <div
              className="aspect-[4/3] w-full cursor-pointer"
              onClick={() => onNavigate('product', product.id)}
            >
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={300}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isFree && <FreeListingBadge variant="compact" />}
              {product.featured && !product.isFree && (
                <Badge className="bg-primary text-white text-[10px] h-5">
                  Featured
                </Badge>
              )}
              {product.discount && !product.isFree && (
                <Badge variant="destructive" className="text-[10px] h-5">
                  -{product.discount}%
                </Badge>
              )}
            </div>

            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 bg-background/70 backdrop-blur-sm hover:bg-background w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                /* Handle wishlist */
              }}
            >
              <Heart className="w-4 h-4 text-foreground/70" />
            </Button>
          </div>

          <div className="p-3 flex-1 flex flex-col">
            <h3
              className="mb-1.5 line-clamp-2 cursor-pointer text-xs sm:text-sm font-semibold leading-tight h-[32px] sm:h-[40px]"
              onClick={() => onNavigate('product', product.id)}
            >
              {product.name}
            </h3>

            <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground">
              <span className="text-[11px] sm:text-xs">{product.seller}</span>
              {product.sellerVerified && (
                <Badge
                  variant="outline"
                  className="text-[9px] sm:text-[10px] px-1 py-0 h-4 border-green-500/50 bg-green-500/10 text-green-700"
                >
                  Verified
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1 mb-3">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-[11px] sm:text-xs font-medium text-foreground">
                {product.rating}
              </span>
              <span className="text-[11px] sm:text-xs text-muted-foreground">
                ({product.reviews})
              </span>
            </div>

            <div className="flex justify-between items-center mt-auto pt-2">
              <div>
                {product.isFree ? (
                  <span className="text-base sm:text-lg font-bold text-green-600">Free</span>
                ) : (
                  <div className="flex items-baseline gap-1 sm:gap-2">
                    <span className="text-base sm:text-lg font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <Button
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
                variant={product.isFree ? 'outline' : 'default'}
                className="rounded-full h-7 w-7 sm:h-8 sm:w-8"
              >
                {product.isFree ? (
                  <Heart className="w-3.5 h-3.5" />
                ) : (
                  <ShoppingCart className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
