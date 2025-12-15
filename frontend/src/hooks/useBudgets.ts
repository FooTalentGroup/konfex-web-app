import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Budget, PresupuestoResponseDto } from "@/types/presupuesto.types";
import { presupuestoService } from "@/services/presupuesto.service";

const formatNumeroPresupuesto = (numero: number): string => {
  const year = new Date().getFullYear();
  const numeroFormateado = numero.toString().padStart(4, "0");
  return `P-${year}-${numeroFormateado}`;
};

const mapPresupuestoToBudget = (
  presupuesto: PresupuestoResponseDto
): Budget => {
  return {
    id: presupuesto.id,
    numeroPresupuesto: formatNumeroPresupuesto(presupuesto.numeroPresupuesto),
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
        const presupuestos = await presupuestoService.getAll();
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
    router.push(`/presupuestos/${budgetId}`);
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
