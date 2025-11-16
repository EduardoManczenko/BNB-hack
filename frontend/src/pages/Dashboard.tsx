import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, LogOut, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import merchantQR from "@/assets/merchant-qr.png";

const Dashboard = () => {
  const navigate = useNavigate();

  const totalBalance = 1245.50;
  const totalToday = 225.50;

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your payment gateway</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="w-fit">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-card border-border">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Total Balance</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-bold">
              ${totalBalance.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs md:text-sm text-success">
              <TrendingUp className="w-4 h-4" />
              <span>+12.5% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Received Today</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-bold">
              ${totalToday.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs md:text-sm text-muted-foreground">
              3 transactions
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Quick Access</CardDescription>
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
              Payment Split
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
