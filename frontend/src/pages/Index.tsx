import { WalletButton } from "@/components/WalletButton";
import { BuyerPanel } from "@/components/BuyerPanel";
import { SellerPanel } from "@/components/SellerPanel";
import { ArbiterPanel } from "@/components/ArbiterPanel";
import { EscrowStatus } from "@/components/EscrowStatus";
import { LandingPage } from "@/components/LandingPage";
import { Shield } from "lucide-react";

interface IndexProps {
  wallet: any;
  escrow: any;
}

const Index = ({ wallet, escrow }: IndexProps) => {
  const role = escrow.getUserRole();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                MyEscrow
              </h1>
              <p className="text-xs text-muted-foreground">
                Secure peer-to-peer transactions
              </p>
            </div>
          </div>

          {wallet.isConnected && <WalletButton wallet={wallet} />}
        </div>
      </header>

      {/* Main */}
      <main
        className={`container mx-auto flex flex-1 flex-col px-4 ${!wallet.isConnected ? "justify-center" : "py-8"
          }`}
      >
        {!wallet.isConnected ? (
          <LandingPage wallet={wallet} />
        ) : (
          <div className="space-y-8">
            {/* Escrow Status & Panels */}
            <div className="grid gap-6">
              <EscrowStatus escrowHook={escrow} />

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {role === "buyer" && <BuyerPanel escrowHook={escrow} />}
                {role === "seller" && <SellerPanel escrowHook={escrow} />}
                {role === "arbiter" && <ArbiterPanel escrowHook={escrow} />}
              </div>
            </div>

            {!role && (
              <p className="text-center text-muted-foreground">
                Connected wallet is not part of this escrow.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
