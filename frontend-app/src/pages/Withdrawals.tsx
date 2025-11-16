import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft } from "lucide-react";

interface WithdrawalTransaction {
  id: string;
  amount: number;
  currency: string;
  network: string;
  date: string;
  hash: string;
  available: boolean;
}

const mockAvailableWithdrawal: WithdrawalTransaction = {
  id: "w1",
  amount: 159020.70,
  currency: "USDC",
  network: "BSC",
  date: "2025-01-15 14:32",
  hash: "0x742d...3a1f",
  available: true
};

const mockUnavailableWithdrawal: WithdrawalTransaction = {
  id: "w2",
  amount: 89890.10,
  currency: "USDT",
  network: "BSC",
  date: "2025-01-13 18:56",
  hash: "0x3c2b...6a5d",
  available: false
};

const formatAmount = (amount: number): string => {
  const parts = amount.toFixed(2).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${integerPart},${parts[1]}`;
};

const Withdrawals = () => {
  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Withdrawals</h1>
      </div>

      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Available</CardTitle>
          <CardDescription className="text-xs md:text-sm">Validated transactions ready to withdraw to your bank account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-success/10 text-success">
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground">Validated Payment</p>
                    <Badge className="bg-success text-success-foreground">Ready</Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                <div className="text-left sm:text-right">
                  <p className="text-base md:text-lg font-bold text-success">
                    ARG {formatAmount(mockAvailableWithdrawal.amount)}
                  </p>
                </div>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                  Withdraw
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Unavailable</CardTitle>
          <CardDescription className="text-xs md:text-sm">Transactions that are not yet available for withdrawal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border gap-4 opacity-60">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-muted text-muted-foreground">
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground">Pending Payment</p>
                    <Badge className="bg-muted text-muted-foreground">Pending</Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                <div className="text-left sm:text-right">
                  <p className="text-base md:text-lg font-bold text-muted-foreground">
                    ARS {formatAmount(mockUnavailableWithdrawal.amount)}
                  </p>
                </div>
                <Button size="sm" disabled className="bg-muted text-muted-foreground w-full sm:w-auto cursor-not-allowed">
                  Unavailable
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Withdrawals;
