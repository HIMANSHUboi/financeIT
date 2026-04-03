import { useMemo } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, BarChart3, Lightbulb } from "lucide-react";

const InsightsPanel = () => {
  const { transactions, totalIncome, totalExpenses } = useFinance();

  const insights = useMemo(() => {
    const catSpend: Record<string, number> = {};
    transactions.filter((t) => t.type === "expense").forEach((t) => {
      catSpend[t.category] = (catSpend[t.category] || 0) + t.amount;
    });
    const topCat = Object.entries(catSpend).sort((a, b) => b[1] - a[1])[0];

    const months: Record<string, { income: number; expenses: number }> = {};
    transactions.forEach((t) => {
      const key = t.date.slice(0, 7);
      if (!months[key]) months[key] = { income: 0, expenses: 0 };
      if (t.type === "income") months[key].income += t.amount;
      else months[key].expenses += t.amount;
    });
    const sortedMonths = Object.entries(months).sort((a, b) => b[0].localeCompare(a[0]));
    const current = sortedMonths[0];
    const previous = sortedMonths[1];

    let expenseChange = 0;
    if (current && previous) {
      expenseChange = ((current[1].expenses - previous[1].expenses) / previous[1].expenses) * 100;
    }

    const avgExpense = transactions.filter((t) => t.type === "expense").length > 0
      ? totalExpenses / transactions.filter((t) => t.type === "expense").length
      : 0;

    return { topCat, expenseChange, avgExpense, currentMonth: current, previousMonth: previous };
  }, [transactions, totalIncome, totalExpenses]);

  const cards = [
    {
      icon: Target,
      title: "Top Spending Category",
      value: insights.topCat ? insights.topCat[0] : "N/A",
      sub: insights.topCat ? `$${insights.topCat[1].toLocaleString()} total` : "",
      color: "text-primary",
      bg: "bg-accent",
    },
    {
      icon: insights.expenseChange > 0 ? TrendingUp : TrendingDown,
      title: "Expense Trend",
      value: `${insights.expenseChange > 0 ? "+" : ""}${insights.expenseChange.toFixed(1)}%`,
      sub: "vs previous month",
      color: insights.expenseChange > 0 ? "text-expense" : "text-income",
      bg: insights.expenseChange > 0 ? "bg-expense/10" : "bg-income/10",
    },
    {
      icon: BarChart3,
      title: "Avg Transaction",
      value: `$${insights.avgExpense.toFixed(2)}`,
      sub: "per expense",
      color: "text-primary",
      bg: "bg-accent",
    },
  ];

  return (
    <Card className="shadow-md border-0 glass-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Insights</CardTitle>
            <CardDescription>Key financial observations</CardDescription>
          </div>
          <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
            <Lightbulb className="h-4 w-4 text-accent-foreground" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Add transactions to see insights</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {cards.map((c) => (
              <div key={c.title} className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 border border-border/50 transition-colors hover:bg-muted/60">
                <div className={`h-9 w-9 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>
                  <c.icon className={`h-4 w-4 ${c.color}`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{c.title}</p>
                  <p className="text-xl font-bold mt-0.5">{c.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.sub}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InsightsPanel;
