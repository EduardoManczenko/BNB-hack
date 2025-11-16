import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Settings, PieChart as PieChartIcon, Plus, Trash2, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

interface SplitRecipient {
  id: string;
  name: string;
  percentage: number;
  address: string;
}

const mockSplitRecipients: SplitRecipient[] = [
  {
    id: "1",
    name: "Platform Fee",
    percentage: 15,
    address: "0x1a2b...3c4d"
  },
  {
    id: "2",
    name: "Partner Commission",
    percentage: 25,
    address: "0x5e6f...7g8h"
  },
  {
    id: "3",
    name: "Merchant Revenue",
    percentage: 60,
    address: "0x9i0j...1k2l"
  }
];

// Monthly yield distribution history (mock data)
const monthlyYieldHistory = [
  {
    month: "Jul",
    "Platform Fee": 180,
    "Partner Commission": 300,
    "Merchant Revenue": 720
  },
  {
    month: "Aug",
    "Platform Fee": 220,
    "Partner Commission": 380,
    "Merchant Revenue": 890
  },
  {
    month: "Sep",
    "Platform Fee": 195,
    "Partner Commission": 320,
    "Merchant Revenue": 780
  },
  {
    month: "Oct",
    "Platform Fee": 250,
    "Partner Commission": 420,
    "Merchant Revenue": 1000
  },
  {
    month: "Nov",
    "Platform Fee": 280,
    "Partner Commission": 470,
    "Merchant Revenue": 1120
  },
  {
    month: "Dec",
    "Platform Fee": 310,
    "Partner Commission": 520,
    "Merchant Revenue": 1250
  }
];

const Split = () => {
  const [splitRecipients, setSplitRecipients] = useState<SplitRecipient[]>(mockSplitRecipients);
  const [isEditingRecipient, setIsEditingRecipient] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<SplitRecipient | null>(null);
  const [newRecipient, setNewRecipient] = useState({ name: "", percentage: 0, address: "" });

  const handleAddRecipient = () => {
    if (!newRecipient.name || !newRecipient.address || newRecipient.percentage <= 0) return;
    
    const recipient: SplitRecipient = {
      id: Date.now().toString(),
      ...newRecipient
    };
    
    setSplitRecipients([...splitRecipients, recipient]);
    setNewRecipient({ name: "", percentage: 0, address: "" });
    setIsEditingRecipient(false);
  };

  const handleRemoveRecipient = (id: string) => {
    setSplitRecipients(splitRecipients.filter(r => r.id !== id));
  };

  const handleUpdateRecipient = () => {
    if (!editingRecipient) return;
    
    setSplitRecipients(splitRecipients.map(r => 
      r.id === editingRecipient.id ? editingRecipient : r
    ));
    setEditingRecipient(null);
  };

  const totalPercentage = splitRecipients.reduce((sum, r) => sum + r.percentage, 0);

  const pieData = splitRecipients.map((recipient) => ({
    name: recipient.name,
    value: recipient.percentage,
  }));

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--accent))'];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Payment Split Configuration</h1>
          <p className="text-sm text-muted-foreground">Configure how incoming payments are distributed</p>
        </div>
        <Badge variant={totalPercentage === 100 ? "default" : "destructive"} className="text-base md:text-lg px-3 md:px-4 py-1 md:py-2 w-fit">
          Total: {totalPercentage}%
        </Badge>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-elevated border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Recipients
            </CardTitle>
            <CardDescription>Manage split recipients and percentages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {splitRecipients.map((recipient) => (
              <div key={recipient.id} className="p-4 rounded-lg bg-muted/30 border border-border">
                {editingRecipient?.id === recipient.id ? (
                  <div className="space-y-3">
                    <div className="grid gap-3">
                      <div>
                        <Label>Investment Name</Label>
                        <Input
                          value={editingRecipient.name}
                          onChange={(e) => setEditingRecipient({...editingRecipient, name: e.target.value})}
                          placeholder="e.g., Platform Fee, Partner Commission"
                        />
                      </div>
                      <div>
                        <Label>Percentage</Label>
                        <Input
                          type="number"
                          value={editingRecipient.percentage}
                          onChange={(e) => setEditingRecipient({...editingRecipient, percentage: Number(e.target.value)})}
                          placeholder="25"
                        />
                      </div>
                      <div>
                        <Label>Wallet Address</Label>
                        <Input
                          value={editingRecipient.address}
                          onChange={(e) => setEditingRecipient({...editingRecipient, address: e.target.value})}
                          placeholder="0x..."
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleUpdateRecipient}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingRecipient(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-foreground">{recipient.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary text-primary-foreground">
                          {recipient.percentage}%
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setEditingRecipient(recipient)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleRemoveRecipient(recipient.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <code className="text-xs text-muted-foreground">{recipient.address}</code>
                  </div>
                )}
              </div>
            ))}

            {isEditingRecipient ? (
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="font-semibold">Add New Investment</h3>
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
                    <Label>Percentage</Label>
                    <Input
                      type="number"
                      value={newRecipient.percentage || ""}
                      onChange={(e) => setNewRecipient({...newRecipient, percentage: Number(e.target.value)})}
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <Label>Wallet Address</Label>
                    <Input
                      value={newRecipient.address}
                      onChange={(e) => setNewRecipient({...newRecipient, address: e.target.value})}
                      placeholder="0x..."
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddRecipient}>Add Investment</Button>
                  <Button variant="outline" onClick={() => {
                    setIsEditingRecipient(false);
                    setNewRecipient({ name: "", percentage: 0, address: "" });
                  }}>Cancel</Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIsEditingRecipient(true)} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add New Investment
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-elevated border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Split Distribution
            </CardTitle>
            <CardDescription>Visual breakdown of payment splits</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
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
            Monthly Yield Distribution
          </CardTitle>
          <CardDescription>Evolution of earnings by investment category</CardDescription>
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
                label={{ value: 'USD ($)', angle: -90, position: 'insideLeft', style: { fill: 'hsl(var(--muted-foreground))' } }}
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
                dataKey="Platform Fee" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
              <Line 
                type="monotone" 
                dataKey="Partner Commission" 
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--success))' }}
              />
              <Line 
                type="monotone" 
                dataKey="Merchant Revenue" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--accent))' }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Platform Fee (Dec)</p>
              <p className="text-xl font-bold text-primary">$310.00</p>
              <p className="text-xs text-success flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +10.7% vs Nov
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Partner Commission (Dec)</p>
              <p className="text-xl font-bold text-success">$520.00</p>
              <p className="text-xs text-success flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +10.6% vs Nov
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Merchant Revenue (Dec)</p>
              <p className="text-xl font-bold text-accent">$1,250.00</p>
              <p className="text-xs text-success flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +11.6% vs Nov
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Split;
