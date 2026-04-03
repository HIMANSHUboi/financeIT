import { useMemo } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const BalanceTrendChart = () => {
  const { transactions } = useFinance();

  const data = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const monthly: Record<string, { income: number; expenses: number }> = {};
    sorted.forEach((t) => {
      const key = t.date.slice(0, 7);
      if (!monthly[key]) monthly[key] = { income: 0, expenses: 0 };
      if (t.type === "income") monthly[key].income += t.amount;
      else monthly[key].expenses += t.amount;
    });
    let balance = 0;
    return Object.entries(monthly).map(([month, v]) => {
      balance += v.income - v.expenses;
      return {
        month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        income: +v.income.toFixed(2),
        expenses: +v.expenses.toFixed(2),
        balance: +balance.toFixed(2),
      };
    });
  }, [transactions]);

  return (
    <Card className="shadow-md border-0 glass-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Balance Trend</CardTitle>
            <CardDescription>Monthly cumulative balance</CardDescription>
          </div>
          <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-accent-foreground" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No data to display</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, ""]}
              />
              <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" fill="url(#colorBalance)" strokeWidth={2.5} name="Balance" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default BalanceTrendChart;
