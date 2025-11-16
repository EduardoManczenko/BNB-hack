import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Settings, PieChart as PieChartIcon, Plus, TrendingUp, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
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

interface SplitRecipient {
  id: string;
  name: string;
  currentBalance: number;
  startDate: string;
  endDate: string;
}

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
};

const getDateDaysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
};

const getSpecificDate = (year: number, month: number, day: number) => {
  const date = new Date(year, month - 1, day); // month is 0-indexed
  return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
};

const getDateDaysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
};

const getEndDate = (startDate: string) => {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(end.getDate() + 30); // Add 30 days
  return end.toISOString().split('T')[0]; // Format: YYYY-MM-DD
};

const getDaysRemaining = (endDate: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const mockSplitRecipients: SplitRecipient[] = [
  {
    id: "1",
    name: "Child School",
    currentBalance: 50,
    startDate: getTodayDate(),
    endDate: getEndDate(getTodayDate())
  },
  {
    id: "2",
    name: "Birthday Party",
    currentBalance: 100,
    startDate: getDateDaysAgo(20), // Started 20 days ago
    endDate: getDateDaysFromNow(10) // Ends in 10 days
  }
];

// Monthly yield distribution history (mock data)
// This will be updated inside the component to use real earnings for November
// Values are in percentage of total investment ($150)
const getMonthlyYieldHistory = (realEarnings: number, totalInvestment: number) => [
  {
    month: "Jul",
    Earning: 0.3 // 0.3%
  },
  {
    month: "Aug",
    Earning: 0.1 // 0.1%
  },
  {
    month: "Sep",
    Earning: 0.4 // 0.4%
  },
  {
    month: "Oct",
    Earning: 0.15 // 0.15%
  },
  {
    month: "Nov",
    Earning: (realEarnings / totalInvestment) * 100 // Real earnings percentage
  }
];

const Split = () => {
  const [splitRecipients, setSplitRecipients] = useState<SplitRecipient[]>(mockSplitRecipients);
  const [isEditingRecipient, setIsEditingRecipient] = useState(false);
  const [newRecipient, setNewRecipient] = useState({ name: "", currentBalance: 0, startDate: getTodayDate(), endDate: getEndDate(getTodayDate()) });

  // Buscar saldo da Binance
  const { data: balanceData, isLoading: isLoadingBalance } = useQuery({
    queryKey: ["balance"],
    queryFn: fetchBalance,
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });

  // Yield fixo de 4.96% ao ano
  const fixedYieldAPY = 4.96;

  // Calculate earned yield since start date
  const calculateEarnedYield = (startDate: string, initialBalance: number) => {
    const start = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - start.getTime();
    const daysElapsed = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (daysElapsed <= 0) return 0;
    
    // Calculate daily rate from APY (compounded)
    // APY = (1 + daily_rate)^365 - 1
    // daily_rate = (1 + APY)^(1/365) - 1
    const dailyRate = Math.pow(1 + (fixedYieldAPY / 100), 1 / 365) - 1;
    
    // Calculate total earned: initial * ((1 + daily_rate)^days - 1)
    const totalEarned = initialBalance * (Math.pow(1 + dailyRate, daysElapsed) - 1);
    
    return totalEarned;
  };

  // Calculate total earnings from all recipients
  const totalEarnings = splitRecipients.reduce((sum, r) => {
    return sum + calculateEarnedYield(r.startDate, r.currentBalance);
  }, 0);

  // Get monthly yield history with real earnings for November
  const totalInvestment = 150; // $50 Child School + $100 Birthday Party
  const monthlyYieldHistory = getMonthlyYieldHistory(totalEarnings, totalInvestment);

  // Total Balance = Real Binance Balance + $150 (Child School $50 + Birthday Party $100) + Total Earnings
  const MOCK_BALANCE_ADDITION = 150; // $50 Child School + $100 Birthday Party
  const availableBalance = balanceData?.success 
    ? parseFloat(balanceData.totalBalance) + MOCK_BALANCE_ADDITION + totalEarnings
    : MOCK_BALANCE_ADDITION + totalEarnings;

  // Calculate vault value (sum of total balances from Child School and Birthday Party)
  const vaultValue = splitRecipients.reduce((sum, r) => {
    const totalWithEarnings = r.currentBalance + calculateEarnedYield(r.startDate, r.currentBalance);
    return sum + totalWithEarnings;
  }, 0);

  // Calculate available for withdrawal (Total Balance - Vault)
  const availableForWithdrawal = availableBalance - vaultValue;

  const handleAddRecipient = () => {
    if (!newRecipient.name || newRecipient.currentBalance <= 0) return;
    
    const recipient: SplitRecipient = {
      id: Date.now().toString(),
      ...newRecipient,
      endDate: getEndDate(newRecipient.startDate)
    };
    
    setSplitRecipients([...splitRecipients, recipient]);
    setNewRecipient({ name: "", currentBalance: 0, startDate: getTodayDate(), endDate: getEndDate(getTodayDate()) });
    setIsEditingRecipient(false);
  };


  const totalSplitBalance = splitRecipients.reduce((sum, r) => sum + r.currentBalance, 0);

  // Map recipients to specific colors
  const getRecipientColor = (recipientName: string) => {
    if (recipientName === "Child School") {
      return "#9333ea"; // Purple color
    } else if (recipientName === "Birthday Party") {
      return "#3b82f6"; // Blue color
    } else if (recipientName === "Earnings") {
      return "#22c55e"; // Green color for earnings
    }
    return "hsl(var(--accent))"; // Default color
  };

  const pieData = [
    ...splitRecipients.map((recipient) => ({
      name: recipient.name,
      value: recipient.currentBalance,
      color: getRecipientColor(recipient.name)
    })),
    // Always show Earnings slice, with minimum value to ensure visibility
    {
      name: "Earnings",
      value: totalEarnings > 0 ? Math.max(totalEarnings, totalSplitBalance * 0.03) : totalSplitBalance * 0.02, // At least 3% of total or 2% if no earnings
      color: getRecipientColor("Earnings")
    }
  ];

  const COLORS = pieData.map(item => item.color);
  
  // Calculate total for percentage calculation (visual total for pie chart)
  const totalValue = pieData.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate real total (initial balances + real earnings) for real percentage calculation
  const realTotal = totalSplitBalance + totalEarnings;

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Earn</h1>
          <p className="text-sm text-muted-foreground">
            Configure how incoming payments are distributed and track automatic earnings <span className="font-semibold text-green-600">+ {fixedYieldAPY}% APY</span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-elevated border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Vaults
            </CardTitle>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Total Balance</p>
                <p className="text-xl font-bold text-foreground">
                  {isLoadingBalance ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    `$${availableBalance.toFixed(2)}`
                  )}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Vault</p>
                <p className="text-xl font-bold text-foreground">
                  ${vaultValue.toFixed(2)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Available for Withdrawal</p>
                <p className="text-xl font-bold text-foreground">
                  {isLoadingBalance ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    `$${availableForWithdrawal.toFixed(2)}`
                  )}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {splitRecipients.map((recipient) => (
              <div key={recipient.id} className="p-4 rounded-lg bg-muted/30 border border-border">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    {(recipient.name === "Child School" || recipient.name === "Birthday Party") && (
                      <div 
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor: getRecipientColor(recipient.name) }}
                      />
                    )}
                    <p className="font-semibold text-foreground">{recipient.name}</p>
                  </div>
                  <div className="space-y-2">
                    {(recipient.name === "Child School" || recipient.name === "Birthday Party") ? (
                      <>
                        <div className="flex items-baseline gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">Initial</p>
                            <p className="text-base font-semibold text-foreground">
                              ${recipient.currentBalance.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">Earn</p>
                            <p className="text-base font-semibold text-success">
                              +${calculateEarnedYield(recipient.startDate, recipient.currentBalance).toFixed(2)}
                            </p>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground mb-0.5">Total</p>
                            <p className="text-base font-bold text-success">
                              ${(recipient.currentBalance + calculateEarnedYield(recipient.startDate, recipient.currentBalance)).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div>
                            <p className="text-xs text-muted-foreground mb-0.5">Balance</p>
                            <p className="text-base font-semibold text-foreground">
                              ${recipient.currentBalance.toFixed(2)}
                            </p>
                          </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={`text-xs font-semibold ${
                        getDaysRemaining(recipient.endDate) > 0 
                          ? "text-warning" 
                          : "text-destructive"
                      }`}>
                        {getDaysRemaining(recipient.endDate) > 0 
                          ? `${getDaysRemaining(recipient.endDate)} days remaining`
                          : "Stake expired"
                        }
                      </p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground">
                        Start: {new Date(recipient.startDate).toLocaleDateString()}
                      </p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground">
                        End: {new Date(recipient.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isEditingRecipient ? (
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="font-semibold">Add New Vault</h3>
                <div className="grid gap-3">
                  <div>
                    <Label>Investment Name</Label>
                    <Input
                      value={newRecipient.name}
                      onChange={(e) => setNewRecipient({...newRecipient, name: e.target.value})}
                      placeholder="e.g., Savings, Trading"
                    />
                  </div>
                  <div>
                    <Label>Current Balance</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newRecipient.currentBalance || ""}
                      onChange={(e) => setNewRecipient({...newRecipient, currentBalance: Number(e.target.value)})}
                      placeholder="10.00"
                    />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={newRecipient.startDate}
                      onChange={(e) => {
                        const newStartDate = e.target.value;
                        setNewRecipient({
                          ...newRecipient, 
                          startDate: newStartDate,
                          endDate: getEndDate(newStartDate)
                        });
                      }}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={newRecipient.endDate}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddRecipient}>Add Investment</Button>
                  <Button variant="outline" onClick={() => {
                    setIsEditingRecipient(false);
                    setNewRecipient({ name: "", currentBalance: 0, startDate: getTodayDate(), endDate: getEndDate(getTodayDate()) });
                  }}>Cancel</Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => {}} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add New Vault
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-elevated border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Vault Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ value, name, cx, cy, midAngle, innerRadius, outerRadius }) => {
                    // Use actual earnings value for display, not the inflated visualization value
                    const displayValue = name === "Earnings" ? totalEarnings : value;
                    // Calculate real percentage based on real total, not visual total
                    const realPercentage = name === "Earnings" 
                      ? (realTotal > 0 ? ((totalEarnings / realTotal) * 100).toFixed(2) : '0.00')
                      : (realTotal > 0 ? ((value / realTotal) * 100).toFixed(2) : '0.00');
                    const RADIAN = Math.PI / 180;
                    // Position label outside the pie slice
                    const radius = outerRadius + 15;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    
                    return (
                      <text 
                        x={x} 
                        y={y} 
                        fill="hsl(var(--foreground))" 
                        textAnchor={x > cx ? 'start' : 'end'} 
                        dominantBaseline="central"
                        fontSize={11}
                        fontWeight="600"
                      >
                        {`$${displayValue.toFixed(2)} (${realPercentage}%)`}
                      </text>
                    );
                  }}
                  outerRadius={80}
                  innerRadius={0}
                  minAngle={1}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  formatter={(value) => <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Yield Evolution */}
      <Card className="shadow-elevated border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
              Monthly Earn Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyYieldHistory}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
                label={{ value: '%', angle: -90, position: 'insideLeft', style: { fill: 'hsl(var(--muted-foreground))' } }}
                tickFormatter={(value) => `${value.toFixed(2)}%`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Earning" 
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--success))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>


    </div>
  );
};

export default Split;
