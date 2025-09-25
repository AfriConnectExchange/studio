'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface PaymentConfirmationProps {
  paymentData: any;
  orderItems: any[];
  orderTotal: number;
  onNavigate: (page: string) => void;
}

export function PaymentConfirmation({
  paymentData,
  orderItems,
  orderTotal,
  onNavigate,
}: PaymentConfirmationProps) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle className="w-24 h-24 text-green-500" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-muted-foreground mb-8">
        Thank you for your order. A confirmation has been sent to your email.
      </p>

      <Card className="text-left">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID:</span>
              <span className="font-mono">#AFRI-12345</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Amount:</span>
              <span className="font-semibold">£{orderTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <span>{paymentData.paymentMethod}</span>
            </div>
             <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-semibold text-green-600">{paymentData.status}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <Button onClick={() => onNavigate('marketplace')} size="lg">Continue Shopping</Button>
        <Button onClick={() => onNavigate('profile')} variant="outline" size="lg">
          View My Orders
        </Button>
      </div>
    </div>
  );
}
