import { EscrowState } from '@/hooks/useEscrow';
import { StatusBadge } from './StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, User, Users, Scale } from 'lucide-react';

interface EscrowStatusProps {
  escrow: EscrowState;
  txHash: string | null;
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function EscrowStatus({ escrow, txHash }: EscrowStatusProps) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              Escrow Status
            </h3>
            <StatusBadge status={escrow.status} />
          </div>

          {/* Details Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Amount */}
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="font-mono text-lg text-foreground">
                {escrow.status === 'idle' ? '—' : `${escrow.amount} ETH`}
              </p>
            </div>

            {/* Buyer */}
            <div className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                Buyer
              </div>
              <p className="font-mono text-sm text-foreground">
                {escrow.buyer ? truncateAddress(escrow.buyer) : '—'}
              </p>
            </div>

            {/* Seller */}
            <div className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                Seller
              </div>
              <p className="font-mono text-sm text-foreground">
                {escrow.seller ? truncateAddress(escrow.seller) : '—'}
              </p>
            </div>

            {/* Arbiter */}
            <div className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Scale className="h-3 w-3" />
                Arbiter
              </div>
              <p className="font-mono text-sm text-foreground">
                {escrow.arbiter ? truncateAddress(escrow.arbiter) : '—'}
              </p>
            </div>
          </div>

          {/* Transaction Hash */}
          {txHash && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Transaction Hash
              </div>
              <p className="font-mono text-xs text-primary break-all">
                {txHash}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
