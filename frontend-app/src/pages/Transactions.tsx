import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft, Search, Download, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import LoadingDots from "@/components/LoadingDots";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

interface Transaction {
  id: string;
  type: "incoming" | "outgoing";
  amount: number;
  amountInUSD: number | null;
  currency: string;
  network: string;
  status: "confirmed" | "pending" | "processing";
  date: string;
  hash: string;
}

// Função para buscar transações da API
const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await fetch(`${API_BASE_URL}/api/transactions`);
  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }
  const data = await response.json();
  if (data.success) {
    return data.transactions;
  }
  throw new Error(data.error || "Failed to fetch transactions");
};

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Buscar transações da API
  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-success text-success-foreground">Confirmed</Badge>;
      case "pending":
        return (
          <Badge variant="outline" className="border-warning text-warning flex items-center gap-2">
            <LoadingDots />
            Pending
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="outline" className="border-primary text-primary flex items-center gap-2">
            <LoadingDots />
            Processing
          </Badge>
        );
    }
  };

  const filteredTransactions = transactions
    .filter(tx =>
      tx.currency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.network.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Ordenar por data em ordem decrescente (mais recente primeiro)
      // Formato da data: "YYYY-MM-DD HH:mm"
      const parseDate = (dateStr: string) => {
        const [datePart, timePart] = dateStr.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hour, minute] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hour, minute).getTime();
      };
      
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateB - dateA; // Ordem decrescente
    });

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Transaction History</h1>
      </div>

      <Card className="shadow-card border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardDescription className="text-xs md:text-sm">Filter and export your transaction history from the last 90 days</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="w-fit">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by currency or network..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading transactions...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-destructive">Error loading transactions</span>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-muted-foreground">No transactions found</span>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border gap-4"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${
                      tx.type === "incoming" 
                        ? "bg-success/10 text-success" 
                        : "bg-primary/10 text-primary"
                    }`}>
                      {tx.type === "incoming" ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">
                          {tx.type === "incoming" ? "Incoming" : "Withdrawal"}
                        </p>
                        {getStatusBadge(tx.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {tx.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-base md:text-lg font-bold ${
                      tx.type === "incoming" ? "text-success" : "text-foreground"
                    }`}>
                      {tx.amountInUSD !== null 
                        ? `${tx.type === "incoming" ? "+" : "-"}$${tx.amountInUSD.toFixed(2)}`
                        : `${tx.type === "incoming" ? "+" : "-"}$0.00`
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
