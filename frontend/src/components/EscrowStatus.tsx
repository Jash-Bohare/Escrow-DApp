import { Card, CardContent } from "@/components/ui/card";
import { Clock, User, Users, Scale, X } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface EscrowStatusProps {
  escrowHook: any;
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function EscrowStatus({ escrowHook }: EscrowStatusProps) {
  const { escrow, txHash, getUserRole } = escrowHook;
  const [showTx, setShowTx] = useState(false);
  const currentRole = getUserRole();

  // Auto-show when txHash changes and hide after 5 seconds
  useEffect(() => {
    if (txHash) {
      setShowTx(true);
      const timer = setTimeout(() => {
        setShowTx(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [txHash]);

  const getRoleStyles = (role: string) => {
    if (currentRole === role) {
      return "border-primary ring-1 ring-primary bg-primary/5";
    }
    return "border-border bg-background";
  };

  const RoleIndicator = ({ role }: { role: string }) => {
    if (currentRole === role) {
      return <div className="ml-auto rounded-full bg-primary/20 p-1"><User className="h-3 w-3 text-primary" /></div>;
    }
    return null;
  };

  return (
    <>
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
                  {escrow.amount ? `${escrow.amount} ETH` : "—"}
                </p>
              </div>

              {/* Buyer */}
              <div className={`rounded-lg border p-4 transition-colors ${getRoleStyles("buyer")}`}>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <User className={`h-3 w-3 ${currentRole === "buyer" ? "text-primary" : ""}`} />
                  <span className={currentRole === "buyer" ? "text-primary font-medium" : ""}>Buyer</span>
                  {currentRole === "buyer" && " (You)"}
                </div>
                <p className="font-mono text-sm text-foreground">
                  {escrow.buyer ? truncateAddress(escrow.buyer) : "—"}
                </p>
              </div>

              {/* Seller */}
              <div className={`rounded-lg border p-4 transition-colors ${getRoleStyles("seller")}`}>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Users className={`h-3 w-3 ${currentRole === "seller" ? "text-primary" : ""}`} />
                  <span className={currentRole === "seller" ? "text-primary font-medium" : ""}>Seller</span>
                  {currentRole === "seller" && " (You)"}
                </div>
                <p className="font-mono text-sm text-foreground">
                  {escrow.seller ? truncateAddress(escrow.seller) : "—"}
                </p>
              </div>

              {/* Arbiter */}
              <div className={`rounded-lg border p-4 transition-colors ${getRoleStyles("arbiter")}`}>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Scale className={`h-3 w-3 ${currentRole === "arbiter" ? "text-primary" : ""}`} />
                  <span className={currentRole === "arbiter" ? "text-primary font-medium" : ""}>Arbiter</span>
                  {currentRole === "arbiter" && " (You)"}
                </div>
                <p className="font-mono text-sm text-foreground">
                  {escrow.arbiter ? truncateAddress(escrow.arbiter) : "—"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Hash - Fixed Position Toast */}
      {txHash && showTx && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2">
          <div className="flex max-w-md items-center gap-3 rounded-lg border border-primary/20 bg-background p-4 shadow-lg ring-1 ring-black/5 dark:ring-white/10">
            <div className="rounded-full bg-primary/10 p-2">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-medium text-foreground">
                Transaction sent
              </p>
              <p className="truncate font-mono text-xs text-muted-foreground">
                {txHash}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={() => setShowTx(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
