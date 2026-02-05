import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EscrowCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: "default" | "buyer" | "seller" | "arbiter";
}

const variantStyles = {
  default: "border-border",
  buyer: "border-blue-500/30 bg-blue-500/5",
  seller: "border-green-500/30 bg-green-500/5",
  arbiter: "border-yellow-500/30 bg-yellow-500/5",
};

export function EscrowCard({
  title,
  description,
  icon,
  children,
  className,
  variant = "default",
}: EscrowCardProps) {
  return (
    <Card className={cn("border", variantStyles[variant], className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card border border-border">
              {icon}
            </div>
          )}

          <div>
            <CardTitle className="text-lg">{title}</CardTitle>

            {description && (
              <CardDescription className="text-muted-foreground">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  );
}
