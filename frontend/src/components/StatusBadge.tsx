import { cn } from "@/lib/utils";
import { EscrowStatus } from "@/hooks/useEscrow";
import {
  Clock,
  Coins,
  Package,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface StatusBadgeProps {
  status: EscrowStatus;
  className?: string;
}

const statusConfig: Record<
  EscrowStatus,
  {
    label: string;
    icon: React.ReactNode;
    className: string;
  }
> = {
  created: {
    label: "Created",
    icon: <Clock className="h-4 w-4" />,
    className: "bg-muted text-muted-foreground",
  },

  funded: {
    label: "Funded",
    icon: <Coins className="h-4 w-4" />,
    className: "bg-blue-500/20 text-blue-500",
  },

  delivered: {
    label: "Delivered",
    icon: <Package className="h-4 w-4" />,
    className: "bg-green-500/20 text-green-500",
  },

  disputed: {
    label: "Disputed",
    icon: <AlertTriangle className="h-4 w-4" />,
    className: "bg-red-500/20 text-red-500",
  },

  completed: {
    label: "Completed",
    icon: <CheckCircle className="h-4 w-4" />,
    className: "bg-green-500/20 text-green-500",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
        config.className,
        className
      )}
    >
      {config.icon}
      {config.label}
    </div>
  );
}
