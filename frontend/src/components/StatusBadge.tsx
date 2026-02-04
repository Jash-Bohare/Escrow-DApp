import { cn } from '@/lib/utils';
import { EscrowStatus } from '@/hooks/useEscrow';
import { 
  Clock, 
  Coins, 
  Package, 
  CheckCircle, 
  AlertTriangle, 
  Shield 
} from 'lucide-react';

interface StatusBadgeProps {
  status: EscrowStatus;
  className?: string;
}

const statusConfig: Record<EscrowStatus, {
  label: string;
  icon: React.ReactNode;
  className: string;
}> = {
  idle: {
    label: 'No Active Escrow',
    icon: <Clock className="h-4 w-4" />,
    className: 'bg-muted text-muted-foreground',
  },
  awaiting_deposit: {
    label: 'Awaiting Deposit',
    icon: <Clock className="h-4 w-4" />,
    className: 'bg-warning/20 text-warning',
  },
  funded: {
    label: 'Funded',
    icon: <Coins className="h-4 w-4" />,
    className: 'bg-primary/20 text-primary',
  },
  delivered: {
    label: 'Delivery Confirmed',
    icon: <Package className="h-4 w-4" />,
    className: 'bg-success/20 text-success',
  },
  released: {
    label: 'Funds Released',
    icon: <CheckCircle className="h-4 w-4" />,
    className: 'bg-success/20 text-success',
  },
  disputed: {
    label: 'Disputed',
    icon: <AlertTriangle className="h-4 w-4" />,
    className: 'bg-destructive/20 text-destructive',
  },
  resolved: {
    label: 'Resolved',
    icon: <Shield className="h-4 w-4" />,
    className: 'bg-success/20 text-success',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium',
        config.className,
        className
      )}
    >
      {config.icon}
      {config.label}
    </div>
  );
}
