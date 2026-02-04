import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Loader2 } from 'lucide-react';

interface WalletButtonProps {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  balance: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletButton({
  isConnected,
  isConnecting,
  address,
  balance,
  onConnect,
  onDisconnect,
}: WalletButtonProps) {
  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="font-mono text-sm text-foreground">
            {truncateAddress(address)}
          </span>
          {balance && (
            <span className="text-sm text-muted-foreground">
              {balance} ETH
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={onDisconnect}
          className="border-border hover:border-destructive hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={onConnect}
      disabled={isConnecting}
      className="bg-primary text-primary-foreground hover:bg-primary/90"
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}
