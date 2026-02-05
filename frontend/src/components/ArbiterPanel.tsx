import { Button } from "@/components/ui/button";
import { EscrowCard } from "./EscrowCard";
import { Scale, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface ArbiterPanelProps {
  escrowHook: any;
}

export function ArbiterPanel({ escrowHook }: ArbiterPanelProps) {
  const { escrow, isLoading, resolveDispute } = escrowHook;

  const canResolve = escrow.status === "disputed";
  const isResolved = escrow.status === "completed";

  return (
    <EscrowCard
      title="Arbiter Panel"
      description="Resolve disputes between parties"
      icon={<Scale className="h-5 w-5 text-yellow-500" />}
      variant="arbiter"
    >
      <div className="space-y-6">
        {/* Dispute Info */}
        <div className="rounded-lg border border-border bg-background p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Disputed Amount</p>
              <p className="font-mono text-2xl text-foreground">
                {escrow.amount ? `${escrow.amount} ETH` : "—"}
              </p>
            </div>

            {canResolve && (
              <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
            )}
          </div>
        </div>

        {/* Resolution Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => resolveDispute(false)}
            disabled={!canResolve || isLoading}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white"
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
            onClick={() => resolveDispute(true)}
            disabled={!canResolve || isLoading}
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
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
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
            <p className="text-sm text-green-500">
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
