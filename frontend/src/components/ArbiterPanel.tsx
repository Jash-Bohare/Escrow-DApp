import { Button } from '@/components/ui/button';
import { EscrowCard } from './EscrowCard';
import { EscrowState } from '@/hooks/useEscrow';
import { Scale, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

interface ArbiterPanelProps {
  escrow: EscrowState;
  isLoading: boolean;
  onResolve: (toParty: 'buyer' | 'seller') => void;
}

export function ArbiterPanel({
  escrow,
  isLoading,
  onResolve,
}: ArbiterPanelProps) {
  const canResolve = escrow.status === 'disputed';
  const isResolved = escrow.status === 'resolved';

  return (
    <EscrowCard
      title="Arbiter Panel"
      description="Resolve disputes between parties"
      icon={<Scale className="h-5 w-5 text-warning" />}
      variant="arbiter"
    >
      <div className="space-y-6">
        {/* Dispute Info */}
        <div className="rounded-lg border border-border bg-background p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Disputed Amount</p>
              <p className="font-mono text-2xl text-foreground">
                {escrow.status === 'disputed' || escrow.status === 'resolved' 
                  ? `${escrow.amount} ETH` 
                  : '—'}
              </p>
            </div>
            {canResolve && (
              <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
            )}
          </div>
        </div>

        {/* Resolution Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => onResolve('buyer')}
            disabled={!canResolve || isLoading}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ArrowLeft className="mr-2 h-4 w-4" />
                To Buyer
              </>
            )}
          </Button>

          <Button
            onClick={() => onResolve('seller')}
            disabled={!canResolve || isLoading}
            variant="outline"
            className="border-success text-success hover:bg-success hover:text-success-foreground"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                To Seller
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Status Message */}
        {isResolved && (
          <div className="rounded-lg border border-success/30 bg-success/10 p-4">
            <p className="text-sm text-success">
              ✓ Dispute has been resolved
            </p>
          </div>
        )}

        {!canResolve && !isResolved && (
          <p className="text-xs text-muted-foreground">
            Resolution options will be available when a dispute is raised.
          </p>
        )}
      </div>
    </EscrowCard>
  );
}
