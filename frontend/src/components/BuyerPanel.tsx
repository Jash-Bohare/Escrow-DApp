import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EscrowCard } from './EscrowCard';
import { EscrowState, EscrowStatus } from '@/hooks/useEscrow';
import { ShoppingCart, Send, AlertTriangle, Loader2 } from 'lucide-react';

interface BuyerPanelProps {
  escrow: EscrowState;
  isLoading: boolean;
  onDeposit: (amount: string) => void;
  onRelease: () => void;
  onDispute: () => void;
}

export function BuyerPanel({
  escrow,
  isLoading,
  onDeposit,
  onRelease,
  onDispute,
}: BuyerPanelProps) {
  const [depositAmount, setDepositAmount] = useState('');

  const handleDeposit = () => {
    if (depositAmount && parseFloat(depositAmount) > 0) {
      onDeposit(depositAmount);
      setDepositAmount('');
    }
  };

  const canDeposit = escrow.status === 'idle';
  const canRelease = escrow.status === 'delivered';
  const canDispute = escrow.status === 'funded' || escrow.status === 'delivered';

  return (
    <EscrowCard
      title="Buyer Panel"
      description="Deposit funds and manage your escrow"
      icon={<ShoppingCart className="h-5 w-5 text-primary" />}
      variant="buyer"
    >
      <div className="space-y-6">
        {/* Deposit Section */}
        <div className="space-y-3">
          <Label htmlFor="deposit-amount" className="text-sm text-muted-foreground">
            Deposit Amount (ETH)
          </Label>
          <div className="flex gap-3">
            <Input
              id="deposit-amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              disabled={!canDeposit || isLoading}
              className="font-mono bg-background border-border"
            />
            <Button
              onClick={handleDeposit}
              disabled={!canDeposit || !depositAmount || isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Deposit'
              )}
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={onRelease}
            disabled={!canRelease || isLoading}
            variant="outline"
            className="border-success text-success hover:bg-success hover:text-success-foreground"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Release Funds
          </Button>

          <Button
            onClick={onDispute}
            disabled={!canDispute || isLoading}
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <AlertTriangle className="mr-2 h-4 w-4" />
            )}
            Raise Dispute
          </Button>
        </div>

        {/* Current Deposit Info */}
        {escrow.status !== 'idle' && (
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">Current Escrow Amount</p>
            <p className="font-mono text-2xl text-foreground">{escrow.amount} ETH</p>
          </div>
        )}
      </div>
    </EscrowCard>
  );
}
