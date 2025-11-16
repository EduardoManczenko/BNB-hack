import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft, Search, Download } from "lucide-react";
import LoadingDots from "@/components/LoadingDots";

interface Transaction {
  id: string;
  type: "incoming" | "outgoing";
  amount: number;
  currency: string;
  network: string;
  status: "confirmed" | "pending" | "processing";
  date: string;
  hash: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "incoming",
    amount: 150.00,
    currency: "USDC",
    network: "BSC",
    status: "confirmed",
    date: "2025-01-15 14:32",
    hash: "0x742d...3a1f"
  },
  {
    id: "2",
    type: "incoming",
    amount: 75.50,
    currency: "USDT",
    network: "Polygon",
    status: "pending",
    date: "2025-01-15 12:18",
    hash: "0x8b3c...7d2e"
  },
  {
    id: "3",
    type: "outgoing",
    amount: 500.00,
    currency: "BRL",
    network: "Off-ramp",
    status: "processing",
    date: "2025-01-14 16:45",
    hash: "0x9f1a...4c8b"
  },
  {
    id: "4",
    type: "incoming",
    amount: 220.00,
    currency: "USDC",
    network: "Ethereum",
    status: "confirmed",
    date: "2025-01-14 10:23",
    hash: "0x5e7d...9b4f"
  },
  {
    id: "5",
    type: "incoming",
    amount: 89.99,
    currency: "USDT",
    network: "BSC",
    status: "confirmed",
    date: "2025-01-13 18:56",
    hash: "0x3c2b...6a5d"
  }
];

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredTransactions = mockTransactions.filter(tx =>
    tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.currency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.network.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Transaction History</h1>
        <p className="text-sm text-muted-foreground">Complete list of all transactions</p>
      </div>

      <Card className="shadow-card border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg md:text-xl">All Transactions</CardTitle>
              <CardDescription className="text-xs md:text-sm">Filter and export your transaction history</CardDescription>
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
                placeholder="Search by hash, currency or network..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                      {tx.network} • {tx.date}
                    </p>
                    <code className="text-xs text-muted-foreground">{tx.hash}</code>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-base md:text-lg font-bold ${
                    tx.type === "incoming" ? "text-success" : "text-foreground"
                  }`}>
                    {tx.type === "incoming" ? "+" : "-"}${tx.amount.toFixed(2)}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">{tx.currency}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
