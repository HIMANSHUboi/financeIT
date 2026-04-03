import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { Transaction, Role, FilterState, Category, TransactionType } from "@/types/finance";
import { mockTransactions } from "@/data/mockTransactions";

interface FinanceContextType {
  transactions: Transaction[];
  role: Role;
  setRole: (role: Role) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  filteredTransactions: Transaction[];
  addTransaction: (t: Omit<Transaction, "id">) => void;
  editTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

export const useFinance = () => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be within FinanceProvider");
  return ctx;
};

const initialFilters: FilterState = {
  search: "",
  type: "all",
  category: "all",
  sortBy: "date",
  sortOrder: "desc",
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [role, setRole] = useState<Role>("admin");
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (t) => t.description.toLowerCase().includes(s) || t.category.toLowerCase().includes(s)
      );
    }
    if (filters.type !== "all") result = result.filter((t) => t.type === filters.type);
    if (filters.category !== "all") result = result.filter((t) => t.category === filters.category);
    result.sort((a, b) => {
      const mul = filters.sortOrder === "asc" ? 1 : -1;
      if (filters.sortBy === "date") return mul * (new Date(a.date).getTime() - new Date(b.date).getTime());
      return mul * (a.amount - b.amount);
    });
    return result;
  }, [transactions, filters]);

  const addTransaction = useCallback((t: Omit<Transaction, "id">) => {
    setTransactions((prev) => [{ ...t, id: crypto.randomUUID() }, ...prev]);
  }, []);

  const editTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const { totalIncome, totalExpenses } = useMemo(() => {
    const inc = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const exp = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { totalIncome: inc, totalExpenses: exp };
  }, [transactions]);

  const totalBalance = totalIncome - totalExpenses;

  return (
    <FinanceContext.Provider
      value={{
        transactions, role, setRole, filters, setFilters,
        filteredTransactions, addTransaction, editTransaction, deleteTransaction,
        totalBalance, totalIncome, totalExpenses,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
