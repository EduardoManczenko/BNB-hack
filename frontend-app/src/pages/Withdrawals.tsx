import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

// Função para buscar saldo da Binance
const fetchBalance = async () => {
  const response = await fetch(`${API_BASE_URL}/api/balance`);
  if (!response.ok) {
    throw new Error("Failed to fetch balance");
  }
  return response.json();
};

interface WithdrawalTransaction {
  id: string;
  amount: number;
  currency: string;
  network: string;
  date: string;
  hash: string;
  available: boolean;
}

// Mock data will be replaced with calculated value
const mockAvailableWithdrawal: WithdrawalTransaction = {
  id: "w1",
  amount: 0,
  currency: "USD",
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
  return amount.toFixed(2);
};

const Withdrawals = () => {
  // Buscar saldo da Binance
  const { data: balanceData, isLoading: isLoadingBalance } = useQuery({
    queryKey: ["balance"],
    queryFn: fetchBalance,
    refetchInterval: 30000,
  });

  // Calculate available for withdrawal (same logic as Split page)
  // This is a simplified version - in a real app, you'd share this logic
  const fixedYieldAPY = 4.96;
  const MOCK_BALANCE_ADDITION = 150; // $50 Child School + $100 Birthday Party
  
  // Mock split recipients for calculation
  const mockSplitRecipients = [
    { currentBalance: 50, startDate: new Date().toISOString().split('T')[0] },
    { currentBalance: 100, startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
  ];

  // Calculate earned yield
  const calculateEarnedYield = (startDate: string, initialBalance: number) => {
    const start = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - start.getTime();
    const daysElapsed = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (daysElapsed <= 0) return 0;
    const dailyRate = Math.pow(1 + (fixedYieldAPY / 100), 1 / 365) - 1;
    const totalEarned = initialBalance * (Math.pow(1 + dailyRate, daysElapsed) - 1);
    return totalEarned;
  };

  const totalEarnings = mockSplitRecipients.reduce((sum, r) => {
    return sum + calculateEarnedYield(r.startDate, r.currentBalance);
  }, 0);

  const availableBalance = balanceData?.success 
    ? parseFloat(balanceData.totalBalance) + MOCK_BALANCE_ADDITION + totalEarnings
    : MOCK_BALANCE_ADDITION + totalEarnings;

  const vaultValue = mockSplitRecipients.reduce((sum, r) => {
    const totalWithEarnings = r.currentBalance + calculateEarnedYield(r.startDate, r.currentBalance);
    return sum + totalWithEarnings;
  }, 0);

  const availableForWithdrawal = availableBalance - vaultValue;

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
                  <ArrowUpRight className="w-5 h-5" />
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
                    {isLoadingBalance ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading...</span>
                      </div>
                    ) : (
                      `$${formatAmount(availableForWithdrawal)}`
                    )}
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
                  <ArrowUpRight className="w-5 h-5" />
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
                    {isLoadingBalance ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading...</span>
                      </div>
                    ) : (
                      `$${formatAmount(vaultValue)}`
                    )}
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
