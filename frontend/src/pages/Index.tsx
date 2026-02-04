import { useWallet } from '@/hooks/useWallet';
import { useEscrow } from '@/hooks/useEscrow';
import { WalletButton } from '@/components/WalletButton';
import { BuyerPanel } from '@/components/BuyerPanel';
import { SellerPanel } from '@/components/SellerPanel';
import { ArbiterPanel } from '@/components/ArbiterPanel';
import { EscrowStatus } from '@/components/EscrowStatus';
import { Button } from '@/components/ui/button';
import { Shield, RotateCcw } from 'lucide-react';

const Index = () => {
  const wallet = useWallet();
  const {
    escrow,
    isLoading,
    txHash,
    depositFunds,
    confirmDelivery,
    releaseFunds,
    raiseDispute,
    resolveDispute,
    resetEscrow,
  } = useEscrow(wallet);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Escrow dApp
              </h1>
              <p className="text-xs text-muted-foreground">
                Secure peer-to-peer transactions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {escrow.status !== 'idle' && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetEscrow}
                className="border-border text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            )}
            <WalletButton
              isConnected={wallet.isConnected}
              isConnecting={wallet.isConnecting}
              address={wallet.address}
              balance={wallet.balance}
              onConnect={wallet.connect}
              onDisconnect={wallet.disconnect}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!wallet.isConnected ? (
          /* Connect Wallet CTA */
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-foreground">
              Connect Your Wallet
            </h2>
            <p className="mb-8 max-w-md text-muted-foreground">
              Connect your Ethereum wallet to create or participate in escrow transactions.
            </p>
            <WalletButton
              isConnected={wallet.isConnected}
              isConnecting={wallet.isConnecting}
              address={wallet.address}
              balance={wallet.balance}
              onConnect={wallet.connect}
              onDisconnect={wallet.disconnect}
            />
            {wallet.error && (
              <p className="mt-4 text-sm text-destructive">{wallet.error}</p>
            )}
          </div>
        ) : (
          /* Escrow Interface */
          <div className="space-y-8">
            {/* Status Section */}
            <EscrowStatus escrow={escrow} txHash={txHash} />

            {/* Panels Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              <BuyerPanel
                escrow={escrow}
                isLoading={isLoading}
                onDeposit={depositFunds}
                onRelease={releaseFunds}
                onDispute={raiseDispute}
              />
              <SellerPanel
                escrow={escrow}
                isLoading={isLoading}
                onConfirmDelivery={confirmDelivery}
              />
              <ArbiterPanel
                escrow={escrow}
                isLoading={isLoading}
                onResolve={resolveDispute}
              />
            </div>

            {/* Instructions */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 text-sm font-medium text-foreground">
                How it works
              </h3>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    1
                  </span>
                  <span>
                    <strong className="text-foreground">Buyer deposits</strong> ETH into the escrow contract
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10 text-xs font-medium text-success">
                    2
                  </span>
                  <span>
                    <strong className="text-foreground">Seller confirms delivery</strong> of goods/services
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    3
                  </span>
                  <span>
                    <strong className="text-foreground">Buyer releases funds</strong> to complete the transaction
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warning/10 text-xs font-medium text-warning">
                    ?
                  </span>
                  <span>
                    <strong className="text-foreground">Arbiter resolves disputes</strong> if parties cannot agree
                  </span>
                </li>
              </ol>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>Demo escrow dApp • Transactions are simulated</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
