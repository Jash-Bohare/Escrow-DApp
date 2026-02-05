import { WalletButton } from "@/components/WalletButton";
import { Shield, CheckCircle, Zap } from "lucide-react";

interface LandingPageProps {
    wallet: any;
}

export function LandingPage({ wallet }: LandingPageProps) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center text-center py-6">
            {/* Hero Section */}
            <div className="mb-8 max-w-3xl space-y-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Shield className="h-8 w-8 text-primary" />
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                    Secure Your Transactions with <span className="text-primary">MyEscrow</span>
                </h1>

                <p className="mx-auto max-w-lg text-base text-muted-foreground">
                    The trustless way to buy and sell online. Funds are held securely until both parties are satisfied.
                </p>

                <div className="pt-2">
                    <WalletButton wallet={wallet} />
                    {wallet.error && (
                        <p className="mt-4 text-sm text-destructive">{wallet.error}</p>
                    )}
                </div>
            </div>

            {/* Feature Grid */}
            <div className="grid gap-6 sm:grid-cols-3">
                <div className="flex flex-col items-center space-y-2 rounded-lg border border-border bg-card p-5 shadow-sm">
                    <div className="rounded-full bg-blue-500/10 p-2.5">
                        <Shield className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="text-base font-semibold">Secure Funding</h3>
                    <p className="text-xs text-muted-foreground">
                        Buyer deposits funds. Money is safe and verifiable.
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-2 rounded-lg border border-border bg-card p-5 shadow-sm">
                    <div className="rounded-full bg-green-500/10 p-2.5">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <h3 className="text-base font-semibold">Verified Delivery</h3>
                    <p className="text-xs text-muted-foreground">
                        Seller confirms delivery. Funds remain locked until fulfilled.
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-2 rounded-lg border border-border bg-card p-5 shadow-sm">
                    <div className="rounded-full bg-yellow-500/10 p-2.5">
                        <Zap className="h-5 w-5 text-yellow-500" />
                    </div>
                    <h3 className="text-base font-semibold">Instant Release</h3>
                    <p className="text-xs text-muted-foreground">
                        Direct release to seller. Fast, low fees, no middlemen.
                    </p>
                </div>
            </div>
        </div>
    );
}
