import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

// Função para buscar depósitos do dia atual da Binance
const fetchTodayDeposits = async () => {
  const response = await fetch(`${API_BASE_URL}/api/deposits/today`);
  if (!response.ok) {
    throw new Error("Failed to fetch today deposits");
  }
  return response.json();
};

// Função para buscar histórico de Earn
const fetchEarnHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/api/earn/history`);
  if (!response.ok) {
    throw new Error("Failed to fetch earn history");
  }
  const data = await response.json();
  if (data.success) {
    return data;
  }
  throw new Error(data.error || "Failed to fetch earn history");
};

const Dashboard = () => {
  const navigate = useNavigate();

  // Buscar saldo da Binance
  const { data: balanceData, isLoading, error } = useQuery({
    queryKey: ["balance"],
    queryFn: fetchBalance,
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });

  // Buscar depósitos do dia atual
  const { 
    data: depositsData, 
    isLoading: isLoadingDeposits, 
    error: depositsError 
  } = useQuery({
    queryKey: ["deposits-today"],
    queryFn: fetchTodayDeposits,
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });

  // Buscar histórico de Earn
  const { 
    data: earnHistoryData, 
    isLoading: isLoadingEarnHistory,
    error: earnHistoryError
  } = useQuery({
    queryKey: ["earn-history"],
    queryFn: fetchEarnHistory,
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });

  const totalBalance = balanceData?.success ? parseFloat(balanceData.totalBalance) : 0;
  const totalToday = depositsData?.success ? parseFloat(depositsData.totalToday) : 0;
  const transactionCount = depositsData?.success ? depositsData.count : 0;
  
  // Calcular total de rendimentos do Earn (soma de todos os juros ganhos)
  const totalEarnYield = earnHistoryData?.success && earnHistoryData.interests
    ? earnHistoryData.interests.reduce((sum: number, interest: { amountInUSD: number | null }) => {
        return sum + (interest.amountInUSD || 0);
      }, 0)
    : 0;

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Balance Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-card border-border">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Total Balance</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-bold">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : error ? (
                <span className="text-destructive">Error loading balance</span>
              ) : (
                `$${totalBalance.toFixed(2)}`
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isLoading && !error && (
              <div className="flex items-center gap-2 text-xs md:text-sm text-success">
                <TrendingUp className="w-4 h-4" />
                <span>Binance Wallet</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card border-border">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Received Today</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-bold">
              {isLoadingDeposits ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : depositsError ? (
                <span className="text-destructive">Error loading deposits</span>
              ) : (
                `$${totalToday.toFixed(2)}`
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isLoadingDeposits && !depositsError && (
              <div className="text-xs md:text-sm text-muted-foreground">
                {transactionCount} {transactionCount === 1 ? 'transaction' : 'transactions'}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card border-border">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Earn Yield (Last 90 Days)</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-bold">
              {isLoadingEarnHistory ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : earnHistoryError ? (
                <span className="text-destructive">Error</span>
              ) : (
                `$${totalEarnYield.toFixed(2)}`
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingEarnHistory ? (
              <div className="text-xs md:text-sm text-muted-foreground">Loading...</div>
            ) : earnHistoryError ? (
              <div className="text-xs md:text-sm text-muted-foreground">Error loading earn data</div>
            ) : earnHistoryData?.success ? (
              <div className="text-xs md:text-sm text-muted-foreground">
                {earnHistoryData.interests?.length || 0} {earnHistoryData.interests?.length === 1 ? 'interest payment' : 'interest payments'}
              </div>
            ) : (
              <div className="text-xs md:text-sm text-muted-foreground">No earn data</div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card border-border sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Payment QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate("/qrcode")}
            >
              View QR Code
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="shadow-card border-border hover:shadow-elevated transition-shadow cursor-pointer" onClick={() => navigate("/transactions")}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base md:text-lg">
              Transactions
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
            </CardTitle>
            <CardDescription className="text-xs">View complete transaction history</CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-card border-border hover:shadow-elevated transition-shadow cursor-pointer" onClick={() => navigate("/split")}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base md:text-lg">
              Earn
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
            </CardTitle>
            <CardDescription className="text-xs">Configure payment distribution</CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-card border-border hover:shadow-elevated transition-shadow cursor-pointer" onClick={() => navigate("/withdrawals")}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base md:text-lg">
              Withdrawals
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
            </CardTitle>
            <CardDescription className="text-xs">Process validated transactions</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
