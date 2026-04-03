import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const SummaryCards = () => {
  const { totalBalance, totalIncome, totalExpenses } = useFinance();

  const cards = [
    {
      label: "Total Balance",
      value: fmt(totalBalance),
      icon: Wallet,
      gradient: "gradient-primary",
      textClass: "text-primary-foreground",
    },
    {
      label: "Total Income",
      value: fmt(totalIncome),
      icon: TrendingUp,
      gradient: "gradient-income",
      textClass: "text-income-foreground",
    },
    {
      label: "Total Expenses",
      value: fmt(totalExpenses),
      icon: TrendingDown,
      gradient: "gradient-expense",
      textClass: "text-expense-foreground",
    },
    {
      label: "Savings Rate",
      value: `${totalIncome > 0 ? ((totalBalance / totalIncome) * 100).toFixed(1) : 0}%`,
      icon: DollarSign,
      gradient: "",
      textClass: "text-card-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <Card
          key={c.label}
          className={`card-hover border-0 shadow-md overflow-hidden ${c.gradient || "glass-card"}`}
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${c.textClass} opacity-80`}>{c.label}</p>
                <p className={`text-2xl font-bold mt-1.5 ${c.textClass}`}>{c.value}</p>
              </div>
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${c.gradient ? "bg-primary-foreground/15" : "bg-muted"}`}>
                <c.icon className={`h-5 w-5 ${c.textClass}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;
