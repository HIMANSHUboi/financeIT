import { useFinance } from "@/context/FinanceContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Eye } from "lucide-react";
import { Role } from "@/types/finance";

const RoleSwitcher = () => {
  const { role, setRole } = useFinance();

  return (
    <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-muted/50">
      {role === "admin" ? <Shield className="h-3.5 w-3.5 text-primary" /> : <Eye className="h-3.5 w-3.5 text-muted-foreground" />}
      <Select value={role} onValueChange={(v) => setRole(v as Role)}>
        <SelectTrigger className="w-[100px] h-7 text-xs border-0 bg-transparent shadow-none focus:ring-0 px-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="viewer">Viewer</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoleSwitcher;
