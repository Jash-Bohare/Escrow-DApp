import { Button } from '@/components/ui/button';
import { EscrowCard } from './EscrowCard';
import { EscrowState } from '@/hooks/useEscrow';
import { Package, CheckCircle, Loader2 } from 'lucide-react';

interface SellerPanelProps {
  escrow: EscrowState;
  isLoading: boolean;
  onConfirmDelivery: () => void;
}

export function SellerPanel({
  escrow,
  isLoading,
  onConfirmDelivery,
}: SellerPanelProps) {
  const canConfirm = escrow.status === 'funded';
  const hasConfirmed = escrow.status === 'delivered' || escrow.status === 'released';

  return (
    <EscrowCard
      title="Seller Panel"
      description="Confirm delivery to release funds"
      icon={<Package className="h-5 w-5 text-success" />}
      variant="seller"
    >
      <div className="space-y-6">
        {/* Status Info */}
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-sm text-muted-foreground">Escrow Amount</p>
          <p className="font-mono text-2xl text-foreground">
            {escrow.status === 'idle' ? '—' : `${escrow.amount} ETH`}
          </p>
        </div>

        {/* Confirm Delivery Button */}
        <Button
          onClick={onConfirmDelivery}
          disabled={!canConfirm || isLoading}
          className="w-full bg-success text-success-foreground hover:bg-success/90"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : hasConfirmed ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Delivery Confirmed
            </>
          ) : (
            <>
              <Package className="mr-2 h-4 w-4" />
              Confirm Delivery
            </>
          )}
        </Button>

        {/* Instructions */}
        <p className="text-xs text-muted-foreground">
          Confirm delivery once the goods/services have been provided. 
          The buyer will then be able to release the funds.
        </p>
      </div>
    </EscrowCard>
  );
}
