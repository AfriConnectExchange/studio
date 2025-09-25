'use client';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldCheck } from 'lucide-react';

interface EscrowPaymentFormProps {
  orderTotal: number;
  onConfirm: (data: any) => void;
  onCancel: () => void;
}

export function EscrowPaymentForm({
  orderTotal,
  onConfirm,
  onCancel,
}: EscrowPaymentFormProps) {
  const handleConfirm = () => {
    onConfirm({
      paymentMethod: 'Escrow',
      amount: orderTotal,
      status: 'Held in Escrow',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Secure Escrow Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">How Escrow Works</AlertTitle>
          <AlertDescription className="text-blue-700">
            Your payment of £{orderTotal.toFixed(2)} will be held securely by
            AfriConnect. We will only release the funds to the seller after you
            confirm that you have received your order as described.
          </AlertDescription>
        </Alert>
        <p className="text-sm text-muted-foreground">
          This method provides maximum protection for your purchase. You have 7
          days after delivery to raise a dispute if there is an issue.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Back
        </Button>
        <Button onClick={handleConfirm}>Fund Escrow</Button>
      </CardFooter>
    </Card>
  );
}
