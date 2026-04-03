import SummaryCards from "@/components/SummaryCards";
import BalanceTrendChart from "@/components/BalanceTrendChart";
import SpendingBreakdownChart from "@/components/SpendingBreakdownChart";
import TransactionsTable from "@/components/TransactionsTable";
import InsightsPanel from "@/components/InsightsPanel";
import RoleSwitcher from "@/components/RoleSwitcher";
import DarkModeToggle from "@/components/DarkModeToggle";
import { FinanceProvider } from "@/context/FinanceContext";
import { LayoutDashboard } from "lucide-react";

const DashboardContent = () => (
  <div className="min-h-screen bg-background">
    <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-10">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
            <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">FinTrack</h1>
        </div>
        <div className="flex items-center gap-1.5">
          <RoleSwitcher />
          <DarkModeToggle />
        </div>
      </div>
    </header>
    <main className="container max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="animate-fade-in">
        <SummaryCards />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
        <BalanceTrendChart />
        <SpendingBreakdownChart />
      </div>
      <div className="animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
        <InsightsPanel />
      </div>
      <div className="animate-slide-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
        <TransactionsTable />
      </div>
    </main>
  </div>
);

const Index = () => (
  <FinanceProvider>
    <DashboardContent />
  </FinanceProvider>
);

export default Index;
