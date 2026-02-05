import { WalletButton } from "@/components/WalletButton";
import { BuyerPanel } from "@/components/BuyerPanel";
import { SellerPanel } from "@/components/SellerPanel";
import { ArbiterPanel } from "@/components/ArbiterPanel";
import { EscrowStatus } from "@/components/EscrowStatus";
import { Shield } from "lucide-react";

interface IndexProps {
  wallet: any;
  escrow: any;
}

const Index = ({ wallet, escrow }: IndexProps) => {
  const role = escrow.getUserRole();

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

          <WalletButton wallet={wallet} />
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        {!wallet.isConnected ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <Shield className="h-10 w-10 text-primary" />
            </div>

            <h2 className="mb-2 text-2xl font-semibold text-foreground">
              Connect Your Wallet
            </h2>

            <p className="mb-8 max-w-md text-muted-foreground">
              Connect your Ethereum wallet to participate in escrow transactions.
            </p>

            <WalletButton wallet={wallet} />

            {wallet.error && (
              <p className="mt-4 text-sm text-destructive">{wallet.error}</p>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Escrow Status */}
            <EscrowStatus escrowHook={escrow} />

            {/* Panels */}
            <div className="grid gap-6 lg:grid-cols-3">
              {role === "buyer" && <BuyerPanel escrowHook={escrow} />}
              {role === "seller" && <SellerPanel escrowHook={escrow} />}
              {role === "arbiter" && <ArbiterPanel escrowHook={escrow} />}
            </div>

            {!role && (
              <p className="text-center text-muted-foreground">
                Connected wallet is not part of this escrow.
              </p>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>Demo escrow dApp • Local Hardhat network</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
