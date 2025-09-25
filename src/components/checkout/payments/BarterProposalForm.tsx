'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Repeat } from 'lucide-react';

interface BarterProposalFormProps {
  targetProduct: {
    id: number;
    name: string;
    seller: string | { name?: string };
    estimatedValue: number;
  };
  onConfirm: (data: any) => void;
  onCancel: () => void;
}

export function BarterProposalForm({
  targetProduct,
  onConfirm,
  onCancel,
}: BarterProposalFormProps) {
  const [proposal, setProposal] = useState('');
  const [offeredItem, setOfferedItem] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');

  const getSellerName = (seller: any) => {
    if (typeof seller === 'string') return seller;
    return seller?.name || 'the seller';
  };

  const handleConfirm = () => {
    onConfirm({
      paymentMethod: 'Barter Proposal',
      targetProduct: targetProduct.name,
      offeredItem,
      estimatedValue,
      proposalMessage: proposal,
      status: 'Proposal Sent',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Propose a Barter/Trade</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
            <Repeat className="h-4 w-4" />
          <AlertDescription>
            You are proposing a trade for{' '}
            <span className="font-semibold">{targetProduct.name}</span> from{' '}
            {getSellerName(targetProduct.seller)}.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="offeredItem">What are you offering to trade?</Label>
          <Input
            id="offeredItem"
            placeholder="e.g., Hand-woven basket, 2 hours of consulting"
            value={offeredItem}
            onChange={(e) => setOfferedItem(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estimatedValue">
            Estimated Value of Your Offer (£)
          </Label>
          <Input
            id="estimatedValue"
            type="number"
            placeholder={`Target value is ~£${targetProduct.estimatedValue.toFixed(
              2
            )}`}
            value={estimatedValue}
            onChange={(e) => setEstimatedValue(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="proposal">Your Message to the Seller</Label>
          <Textarea
            id="proposal"
            placeholder="Explain your trade offer. Include details about your item/service, its condition, and why it's a good trade."
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            rows={4}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Back
        </Button>
        <Button onClick={handleConfirm} disabled={!offeredItem || !proposal}>
          Send Proposal
        </Button>
      </CardFooter>
    </Card>
  );
}
