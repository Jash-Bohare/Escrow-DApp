import { Button } from "@/components/ui/button";
import { EscrowCard } from "./EscrowCard";
import { Package, CheckCircle, Loader2 } from "lucide-react";

interface SellerPanelProps {
  escrowHook: any;
}

export function SellerPanel({ escrowHook }: SellerPanelProps) {
  const { escrow, isLoading, confirmDelivery, raiseDispute } = escrowHook;

  const canConfirm = escrow.status === "funded";
  const hasConfirmed =
    escrow.status === "delivered" || escrow.status === "completed";

  return (
    <EscrowCard
      title="Seller Panel"
      description="Confirm delivery to release funds"
      icon={<Package className="h-5 w-5 text-green-500" />}
      variant="seller"
    >
      <div className="space-y-6">
        {/* Escrow Amount */}
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-sm text-muted-foreground">Escrow Amount</p>
          <p className="font-mono text-2xl text-foreground">
            {escrow.amount ? `${escrow.amount} ETH` : "—"}
          </p>
        </div>

        {/* Confirm Delivery Button */}
        <Button
          onClick={confirmDelivery}
          disabled={!canConfirm || isLoading}
          className="w-full bg-green-500 text-white hover:bg-green-600"
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

        {/* Dispute Button */}
        {(escrow.status === "funded" || escrow.status === "delivered") && (
          <Button
            onClick={raiseDispute}
            variant="outline"
            disabled={isLoading}
            className="w-full border-destructive text-destructive hover:bg-destructive hover:text-white"
          >
            Raise Dispute
          </Button>
        )}

        {/* Instructions */}
        <p className="text-xs text-muted-foreground">
          Confirm delivery once the goods/services have been provided. The buyer
          will then be able to release the funds.
        </p>
      </div>
    </EscrowCard>
  );
}
