'use client';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Banknote } from 'lucide-react';

interface CashOnDeliveryFormProps {
  orderTotal: number;
  onConfirm: (data: any) => void;
  onCancel: () => void;
}

export function CashOnDeliveryForm({
  orderTotal,
  onConfirm,
  onCancel,
}: CashOnDeliveryFormProps) {
  const handleConfirm = () => {
    onConfirm({
      paymentMethod: 'Cash on Delivery',
      amount: orderTotal,
      status: 'Pending',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash on Delivery</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Banknote className="h-4 w-4" />
          <AlertTitle>Instructions</AlertTitle>
          <AlertDescription>
            You will pay the total amount of £{orderTotal.toFixed(2)} in cash to
            the delivery agent when your order arrives. Please have the exact
            amount ready.
          </AlertDescription>
        </Alert>
        <p className="text-sm text-muted-foreground">
          By confirming, you agree to pay the total amount upon delivery.
          Failure to do so may result in account restrictions.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Back
        </Button>
        <Button onClick={handleConfirm}>Confirm Order</Button>
      </CardFooter>
    </Card>
  );
}
