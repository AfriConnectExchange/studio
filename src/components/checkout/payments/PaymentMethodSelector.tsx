'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  Banknote,
  ShieldCheck,
  Repeat,
  Wallet,
} from 'lucide-react';

interface PaymentMethodSelectorProps {
  orderTotal: number;
  onSelectMethod: (method: any) => void;
}

const paymentMethods = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Pay securely with your card.',
    icon: CreditCard,
    type: 'online',
    tags: ['Secure', 'Instant'],
  },
  {
    id: 'wallet',
    name: 'AfriConnect Wallet',
    description: 'Use your wallet balance.',
    icon: Wallet,
    type: 'online',
    tags: ['Fast', 'No Fees'],
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when your order arrives.',
    icon: Banknote,
    type: 'cash',
    tags: ['Pay Later'],
  },
  {
    id: 'escrow',
    name: 'Secure Escrow',
    description: 'Payment held until delivery confirmed.',
    icon: ShieldCheck,
    type: 'escrow',
    tags: ['Buyer Protection'],
  },
  {
    id: 'barter',
    name: 'Barter/Trade',
    description: 'Propose a trade with the seller.',
    icon: Repeat,
    type: 'barter',
    tags: ['Trade Goods'],
  },
];

export function PaymentMethodSelector({
  orderTotal,
  onSelectMethod,
}: PaymentMethodSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between"
            onClick={() => onSelectMethod(method)}
          >
            <div className="flex items-start gap-4">
              <method.icon className="w-8 h-8 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">{method.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {method.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {method.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-4 sm:mt-0 ml-auto sm:ml-4">
              Select
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
