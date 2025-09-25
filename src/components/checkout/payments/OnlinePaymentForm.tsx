'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Wallet, User, Calendar, Lock } from 'lucide-react';

interface OnlinePaymentFormProps {
  orderTotal: number;
  onConfirm: (data: any) => void;
  onCancel: () => void;
  paymentType: 'card' | 'wallet';
}

export function OnlinePaymentForm({
  orderTotal,
  onConfirm,
  onCancel,
  paymentType,
}: OnlinePaymentFormProps) {
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  });

  const handleConfirm = () => {
    onConfirm({
      paymentMethod:
        paymentType === 'card' ? 'Credit/Debit Card' : 'AfriConnect Wallet',
      amount: orderTotal,
      cardDetails: paymentType === 'card' ? cardDetails : undefined,
      status: 'Processing',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {paymentType === 'card' ? (
            <CreditCard className="w-6 h-6" />
          ) : (
            <Wallet className="w-6 h-6" />
          )}
          <span>
            {paymentType === 'card' ? 'Card Payment' : 'Wallet Payment'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentType === 'card' ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="cardNumber" placeholder="**** **** **** ****" className="pl-10"/>
              </div>
            </div>
            <div>
              <Label htmlFor="cardName">Name on Card</Label>
               <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="cardName" placeholder="John Doe" className="pl-10" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                 <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="expiryDate" placeholder="MM/YY" className="pl-10"/>
                </div>
              </div>
              <div>
                <Label htmlFor="cvc">CVC</Label>
                 <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="cvc" placeholder="***" className="pl-10"/>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p>
              Your wallet balance will be used for this purchase.
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Available Balance:</span>
                    <span className="font-bold text-lg">£500.00</span>
                </div>
                 <div className="flex justify-between items-center mt-2">
                    <span className="text-muted-foreground">Order Total:</span>
                    <span className="font-bold text-lg text-primary">- £{orderTotal.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between items-center mt-2 border-t pt-2">
                    <span className="text-muted-foreground">Remaining Balance:</span>
                    <span className="font-bold text-lg text-green-600">£{(500 - orderTotal).toFixed(2)}</span>
                </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Back
        </Button>
        <Button onClick={handleConfirm}>Pay £{orderTotal.toFixed(2)}</Button>
      </CardFooter>
    </Card>
  );
}
