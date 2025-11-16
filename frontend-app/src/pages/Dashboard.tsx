import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { API_BASE_URL } from "@/config/api";

// Função para buscar saldo da Binance
const fetchBalance = async () => {
  const url = `${API_BASE_URL}/api/balance`;
  console.log('[Dashboard] Fetching balance from:', url);
  
  try {
    const response = await fetch(url);
    console.log('[Dashboard] Balance response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Dashboard] Balance fetch failed:', response.status, errorText);
      throw new Error(`Failed to fetch balance: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('[Dashboard] Balance data received:', data);
    return data;
  } catch (error) {
    console.error('[Dashboard] Balance fetch error:', error);
    throw error;
  }
};

// Função para buscar depósitos do dia atual da Binance
const fetchTodayDeposits = async () => {
  const url = `${API_BASE_URL}/api/deposits/today`;
  console.log('[Dashboard] Fetching today deposits from:', url);
  
  try {
    const response = await fetch(url);
    console.log('[Dashboard] Deposits response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Dashboard] Deposits fetch failed:', response.status, errorText);
      throw new Error(`Failed to fetch today deposits: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('[Dashboard] Deposits data received:', data);
    return data;
  } catch (error) {
    console.error('[Dashboard] Deposits fetch error:', error);
    throw error;
  }
};

const Dashboard = () => {
  const navigate = useNavigate();

  // Buscar saldo da Binance
  const { data: balanceData, isLoading, error } = useQuery({
    queryKey: ["balance"],
    queryFn: fetchBalance,
    refetchInterval: 30000, // Atualizar a cada 30 segundos
    retry: 2, // Retry 2 times on failure
  });

  // Log balance data changes
  useEffect(() => {
    if (balanceData) {
      console.log('[Dashboard] Balance query success:', balanceData);
    }
  }, [balanceData]);

  useEffect(() => {
    if (error) {
      console.error('[Dashboard] Balance query error:', error);
    }
  }, [error]);

  // Buscar depósitos do dia atual
  const { 
    data: depositsData, 
    isLoading: isLoadingDeposits, 
    error: depositsError 
  } = useQuery({
    queryKey: ["deposits-today"],
    queryFn: fetchTodayDeposits,
    refetchInterval: 30000, // Atualizar a cada 30 segundos
    retry: 2, // Retry 2 times on failure
  });

  // Log deposits data changes
  useEffect(() => {
    if (depositsData) {
      console.log('[Dashboard] Deposits query success:', depositsData);
    }
  }, [depositsData]);

  useEffect(() => {
    if (depositsError) {
      console.error('[Dashboard] Deposits query error:', depositsError);
    }
  }, [depositsError]);

  const MOCK_BALANCE_ADDITION = 150; // Mock addition to balance
  const totalBalance = (balanceData as any)?.success 
    ? parseFloat((balanceData as any).totalBalance) + MOCK_BALANCE_ADDITION 
    : MOCK_BALANCE_ADDITION;
  const totalToday = (depositsData as any)?.success ? parseFloat((depositsData as any).totalToday) : 0;
  const transactionCount = (depositsData as any)?.success ? (depositsData as any).count : 0;

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
