import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, ArrowUpDown, Pencil, Trash2, Search, ListFilter } from "lucide-react";
import { Category, TransactionType, Transaction } from "@/types/finance";

const categories: Category[] = ["Salary", "Freelance", "Food", "Transport", "Shopping", "Entertainment", "Bills", "Healthcare", "Education", "Investment", "Other"];

const TransactionForm = ({ initial, onSubmit, onClose }: {
  initial?: Transaction;
  onSubmit: (t: Omit<Transaction, "id">) => void;
  onClose: () => void;
}) => {
  const [form, setForm] = useState({
    date: initial?.date || new Date().toISOString().slice(0, 10),
    description: initial?.description || "",
    amount: initial?.amount?.toString() || "",
    category: initial?.category || ("Food" as Category),
    type: initial?.type || ("expense" as TransactionType),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    onSubmit({ ...form, amount: parseFloat(form.amount) });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date</Label>
          <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as TransactionType })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Transaction description" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Amount</Label>
          <Input type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as Category })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" className="w-full">{initial ? "Update" : "Add"} Transaction</Button>
    </form>
  );
};

const TransactionsTable = () => {
  const { filteredTransactions, filters, setFilters, role, addTransaction, editTransaction, deleteTransaction } = useFinance();
  const [addOpen, setAddOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const isAdmin = role === "admin";

  const toggleSort = (field: "date" | "amount") => {
    setFilters((f) => ({
      ...f,
      sortBy: field,
      sortOrder: f.sortBy === field && f.sortOrder === "desc" ? "asc" : "desc",
    }));
  };

  return (
    <Card className="shadow-md border-0 glass-card overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
              <ListFilter className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Transactions</CardTitle>
              <CardDescription>{filteredTransactions.length} records</CardDescription>
            </div>
          </div>
          {isAdmin && (
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Transaction</DialogTitle></DialogHeader>
                <TransactionForm onSubmit={(t) => addTransaction(t)} onClose={() => setAddOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="pl-9"
            />
          </div>
          <Select value={filters.type} onValueChange={(v) => setFilters((f) => ({ ...f, type: v as any }))}>
            <SelectTrigger className="w-full sm:w-[130px]"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.category} onValueChange={(v) => setFilters((f) => ({ ...f, category: v as any }))}>
            <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {filteredTransactions.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No transactions found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => toggleSort("date")}>
                    <span className="flex items-center gap-1">Date <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Description</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                  <th className="text-right p-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => toggleSort("amount")}>
                    <span className="flex items-center justify-end gap-1">Amount <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  {isAdmin && <th className="p-3 w-20"></th>}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3 text-muted-foreground">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="p-3 font-medium">{t.description}</td>
                    <td className="p-3"><Badge variant="secondary" className="text-xs font-normal">{t.category}</Badge></td>
                    <td className={`p-3 text-right font-semibold ${t.type === "income" ? "text-income" : "text-expense"}`}>
                      {t.type === "income" ? "+" : "-"}${t.amount.toLocaleString()}
                    </td>
                    {isAdmin && (
                      <td className="p-3">
                        <div className="flex gap-1">
                          <Dialog open={editingTx?.id === t.id} onOpenChange={(o) => !o && setEditingTx(null)}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-accent" onClick={() => setEditingTx(t)}>
                                <Pencil className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader><DialogTitle>Edit Transaction</DialogTitle></DialogHeader>
                              <TransactionForm
                                initial={t}
                                onSubmit={(upd) => editTransaction(t.id, upd)}
                                onClose={() => setEditingTx(null)}
                              />
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-expense/10 text-expense" onClick={() => deleteTransaction(t.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionsTable;
