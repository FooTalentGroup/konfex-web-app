import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Budget, BudgetResponseDto } from "@/types/budget.types";
import { budgetService } from "@/services/budget.service";
import { formatBudgetNumber } from "@/utils/budgetDetailMapper";

const mapPresupuestoToBudget = (
  presupuesto: BudgetResponseDto
): Budget => {
  return {
    id: presupuesto.id,
    numeroPresupuesto: formatBudgetNumber(presupuesto.numeroPresupuesto),
    clienteNombre: presupuesto.cliente?.nombre || "Sin cliente",
    totalFinal: presupuesto.totalFinal,
    fechaVencimiento: presupuesto.fechaVencimiento,
    estado: presupuesto.estado,
  };
};

export const useBudgets = () => {
  const router = useRouter();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const presupuestos = await budgetService.getAll();
        const budgetsMapeados = presupuestos.map(mapPresupuestoToBudget);
        setBudgets(budgetsMapeados);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al cargar presupuestos";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  const filteredBudgets = useMemo(() => {
    if (!searchQuery.trim()) {
      return budgets;
    }

    const searchTerm = searchQuery.toLowerCase();
    return budgets.filter(
      (budget) =>
        budget.numeroPresupuesto.toLowerCase().includes(searchTerm) ||
        budget.clienteNombre.toLowerCase().includes(searchTerm)
    );
  }, [budgets, searchQuery]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleBudgetClick = (budgetId: number) => {
    // Navegar a la página de detalle del presupuesto
    router.push(`/budgets/${budgetId}`);
  };

  return {
    budgets,
    filteredBudgets,
    searchQuery,
    handleSearch,
    handleBudgetClick,
    isLoading,
    error,
  };
};
